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
    
    const where: Record<string, unknown> = {};
    if (query.articleId) where.articleId = query.articleId;
    if (query.momentId) where.momentId = query.momentId;
    
    const comments = await prisma.comment.findMany({
      where,
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        visitor: { select: { id: true, nickname: true, avatar: true } },
      },
    });
    
    return comments;
  });

  fastify.post('/', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    const body = createCommentSchema.parse(request.body);
    
    if (!body.articleId && !body.momentId) {
      return { error: '必须指定文章或说说' };
    }
    
    const comment = await prisma.comment.create({
      data: {
        content: body.content,
        visitorId: request.user!.id,
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
