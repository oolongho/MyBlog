import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

const applySchema = z.object({
  name: z.string().min(1),
  avatar: z.string().optional(),
  url: z.string().url(),
  description: z.string().min(1),
  email: z.string().email().optional(),
});

export default async function friendRoutes(fastify: FastifyInstance) {
  fastify.get('/', async () => {
    return prisma.friendLink.findMany({
      where: { status: 1 },
      orderBy: { createdAt: 'desc' },
    });
  });

  fastify.get('/all', {
    onRequest: [fastify.authenticateAdmin],
  }, async () => {
    return prisma.friendLink.findMany({
      orderBy: { createdAt: 'desc' },
    });
  });

  fastify.post('/apply', async (request) => {
    const body = applySchema.parse(request.body);
    
    const defaultAvatars = ['🌟', '🚀', '💻', '🎨', '📚', '🔥', '⚡', '🎯', '💎', '🌈'];
    const avatar = body.avatar || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
    
    return prisma.friendLink.create({
      data: {
        name: body.name,
        avatar: avatar,
        url: body.url,
        description: body.description,
        status: 0,
      },
    });
  });

  fastify.put('/:id/status', {
    onRequest: [fastify.authenticateAdmin],
  }, async (request) => {
    const id = Number((request.params as { id: string }).id);
    const body = z.object({ status: z.number().int().min(0).max(2) }).parse(request.body);
    
    return prisma.friendLink.update({
      where: { id },
      data: { status: body.status },
    });
  });

  fastify.put('/:id', {
    onRequest: [fastify.authenticateAdmin],
  }, async (request) => {
    const id = Number((request.params as { id: string }).id);
    const body = applySchema.partial().parse(request.body);
    
    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.avatar !== undefined) updateData.avatar = body.avatar;
    if (body.url !== undefined) updateData.url = body.url;
    if (body.description !== undefined) updateData.description = body.description;
    
    return prisma.friendLink.update({
      where: { id },
      data: updateData,
    });
  });

  fastify.delete('/:id', {
    onRequest: [fastify.authenticateAdmin],
  }, async (request) => {
    const id = Number((request.params as { id: string }).id);
    
    await prisma.friendLink.delete({ where: { id } });
    
    return { success: true };
  });
}
