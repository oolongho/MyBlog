import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

const createCommentSchema = z.object({
  content: z.string().min(1),
  articleId: z.number().int().positive().optional(),
  momentId: z.number().int().positive().optional(),
  parentId: z.number().int().positive().optional(),
});

export default async function commentRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request) => {
    const query = z.object({
      page: z.coerce.number().int().min(1).default(1),
      pageSize: z.coerce.number().int().min(1).max(50).default(20),
      articleId: z.coerce.number().int().optional(),
      momentId: z.coerce.number().int().optional(),
    }).parse(request.query);
    
    const where: Record<string, unknown> = { parentId: null };
    if (query.articleId) where.articleId = query.articleId;
    if (query.momentId) where.momentId = query.momentId;
    
    const comments = await prisma.comment.findMany({
      where,
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        visitor: { select: { id: true, nickname: true, avatar: true } },
        article: { select: { id: true, title: true } },
        moment: { select: { id: true } },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            visitor: { select: { id: true, nickname: true, avatar: true } },
          },
        },
      },
    });
    
    return comments;
  });

  fastify.get('/all', {
    onRequest: [fastify.authenticateAdmin],
  }, async () => {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        visitor: { select: { id: true, nickname: true, avatar: true } },
        article: { select: { id: true, title: true } },
        moment: { select: { id: true } },
        parent: { select: { id: true } },
      },
    });
    
    return comments;
  });

  fastify.post('/', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const body = createCommentSchema.parse(request.body);
    
    if (!body.articleId && !body.momentId) {
      reply.code(400);
      return { error: '必须指定文章或说说' };
    }
    
    let visitorId: number;
    
    if (request.user!.role === 'visitor') {
      visitorId = request.user!.id;
    } else {
      let visitor = await prisma.visitor.findFirst({
        where: { email: `admin_${request.user!.id}@local` },
      });
      
      if (!visitor) {
        visitor = await prisma.visitor.create({
          data: {
            nickname: `管理员`,
            email: `admin_${request.user!.id}@local`,
            provider: 'admin',
            providerId: String(request.user!.id),
          },
        });
      }
      
      visitorId = visitor.id;
    }
    
    if (body.parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: body.parentId },
      });
      
      if (!parentComment) {
        reply.code(400);
        return { error: '父评论不存在' };
      }
    }
    
    const comment = await prisma.comment.create({
      data: {
        content: body.content,
        visitorId,
        articleId: body.articleId,
        momentId: body.momentId,
        parentId: body.parentId,
      },
      include: {
        visitor: { select: { id: true, nickname: true, avatar: true } },
      },
    });
    
    return comment;
  });

  fastify.delete('/:id', {
    onRequest: [fastify.authenticateAdmin],
  }, async (request) => {
    const id = Number((request.params as { id: string }).id);
    
    await prisma.comment.delete({ where: { id } });
    
    return { success: true };
  });
}
