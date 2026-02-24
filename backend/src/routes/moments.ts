import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

const createMomentSchema = z.object({
  content: z.string().min(1),
  images: z.array(z.string().url()).optional(),
});

export default async function momentRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request) => {
    const query = z.object({
      page: z.coerce.number().int().min(1).default(1),
      pageSize: z.coerce.number().int().min(1).max(50).default(10),
    }).parse(request.query);
    
    const moments = await prisma.moment.findMany({
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, nickname: true, avatar: true } },
        _count: { select: { comments: true, likeRecords: true } },
      },
    });
    
    return moments.map(m => ({
      ...m,
      images: JSON.parse(m.images || '[]'),
      commentCount: m._count.comments,
      likeCount: m._count.likeRecords,
    }));
  });

  fastify.get('/:id', async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    
    const moment = await prisma.moment.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, nickname: true, avatar: true } },
      },
    });
    
    if (!moment) {
      return reply.code(404).send({ error: '说说不存在' });
    }
    
    return {
      ...moment,
      images: JSON.parse(moment.images || '[]'),
    };
  });

  fastify.post('/', {
    onRequest: [fastify.authenticateAdmin],
  }, async (request) => {
    const body = createMomentSchema.parse(request.body);
    
    const moment = await prisma.moment.create({
      data: {
        content: body.content,
        images: JSON.stringify(body.images || []),
        authorId: request.user!.id,
      },
    });
    
    return { ...moment, images: body.images || [] };
  });

  fastify.delete('/:id', {
    onRequest: [fastify.authenticateAdmin],
  }, async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    
    await prisma.moment.delete({ where: { id } });
    
    return { success: true };
  });

  fastify.post('/:id/like', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    const visitorId = request.user!.id;
    
    const existing = await prisma.like.findUnique({
      where: { visitorId_momentId: { visitorId, momentId: id } },
    });
    
    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      await prisma.moment.update({
        where: { id },
        data: { likes: { decrement: 1 } },
      });
      return { liked: false };
    }
    
    await prisma.like.create({
      data: { visitorId, momentId: id },
    });
    await prisma.moment.update({
      where: { id },
      data: { likes: { increment: 1 } },
    });
    
    return { liked: true };
  });
}
