import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

const createArticleSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  cover: z.string().url().optional(),
  category: z.string().min(1),
  tags: z.array(z.string()).optional(),
  status: z.number().int().min(0).max(1).optional(),
});

const updateArticleSchema = createArticleSchema.partial();

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  category: z.string().optional(),
  status: z.coerce.number().int().optional(),
  keyword: z.string().optional(),
});

export default async function articleRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request) => {
    const query = querySchema.parse(request.query);
    const skip = (query.page - 1) * query.pageSize;
    
    const where: Record<string, unknown> = {};
    if (query.category) where.category = query.category;
    if (query.status !== undefined) where.status = query.status;
    if (query.keyword) {
      where.OR = [
        { title: { contains: query.keyword } },
        { excerpt: { contains: query.keyword } },
      ];
    }
    
    const [total, articles] = await Promise.all([
      prisma.article.count({ where }),
      prisma.article.findMany({
        where,
        skip,
        take: query.pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, nickname: true } },
          tags: { select: { name: true } },
          _count: { select: { comments: true } },
        },
      }),
    ]);
    
    return {
      total,
      page: query.page,
      pageSize: query.pageSize,
      data: articles.map(a => ({
        ...a,
        tags: a.tags.map(t => t.name),
        commentCount: a._count.comments,
      })),
    };
  });

  fastify.get('/:id', async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, nickname: true, avatar: true } },
        tags: { select: { name: true } },
      },
    });
    
    if (!article) {
      return reply.code(404).send({ error: '文章不存在' });
    }
    
    return {
      ...article,
      tags: article.tags.map(t => t.name),
    };
  });

  fastify.post('/:id/view', async (request) => {
    const id = Number((request.params as { id: string }).id);
    
    await prisma.article.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
    
    return { success: true };
  });

  fastify.post('/', {
    onRequest: [fastify.authenticateAdmin],
  }, async (request) => {
    const body = createArticleSchema.parse(request.body);
    
    const article = await prisma.article.create({
      data: {
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        cover: body.cover,
        category: body.category,
        status: body.status ?? 0,
        authorId: request.user!.id,
        tags: {
          connectOrCreate: (body.tags ?? []).map(name => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: { tags: true },
    });
    
    return article;
  });

  fastify.put('/:id', {
    onRequest: [fastify.authenticateAdmin],
  }, async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    const body = updateArticleSchema.parse(request.body);
    
    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return reply.code(404).send({ error: '文章不存在' });
    }
    
    const article = await prisma.article.update({
      where: { id },
      data: {
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        cover: body.cover,
        category: body.category,
        status: body.status,
        tags: body.tags ? {
          set: [],
          connectOrCreate: body.tags.map(name => ({
            where: { name },
            create: { name },
          })),
        } : undefined,
      },
      include: { tags: true },
    });
    
    return article;
  });

  fastify.delete('/:id', {
    onRequest: [fastify.authenticateAdmin],
  }, async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    
    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return reply.code(404).send({ error: '文章不存在' });
    }
    
    await prisma.article.delete({ where: { id } });
    
    return { success: true };
  });
}
