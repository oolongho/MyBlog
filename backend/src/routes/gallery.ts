import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

const createImageSchema = z.object({
  url: z.string().url(),
  thumbnail: z.string().url().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

export default async function galleryRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request) => {
    const query = z.object({
      page: z.coerce.number().int().min(1).default(1),
      pageSize: z.coerce.number().int().min(1).max(50).default(20),
      category: z.string().optional(),
    }).parse(request.query);
    
    const where = query.category ? { category: query.category } : {};
    
    const images = await prisma.galleryImage.findMany({
      where,
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      orderBy: { createdAt: 'desc' },
      include: { tags: { select: { name: true } } },
    });
    
    return images.map(img => ({
      ...img,
      tags: img.tags.map(t => t.name),
    }));
  });

  fastify.post('/', {
    onRequest: [fastify.authenticateAdmin],
  }, async (request) => {
    const body = createImageSchema.parse(request.body);
    
    const image = await prisma.galleryImage.create({
      data: {
        url: body.url,
        thumbnail: body.thumbnail,
        title: body.title,
        description: body.description,
        category: body.category,
        tags: {
          connectOrCreate: (body.tags ?? []).map(name => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: { tags: true },
    });
    
    return image;
  });

  fastify.put('/:id', {
    onRequest: [fastify.authenticateAdmin],
  }, async (request) => {
    const id = Number((request.params as { id: string }).id);
    const body = createImageSchema.partial().parse(request.body);
    
    const updateData: Record<string, unknown> = {};
    if (body.url !== undefined) updateData.url = body.url;
    if (body.thumbnail !== undefined) updateData.thumbnail = body.thumbnail;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.category !== undefined) updateData.category = body.category;
    
    if (body.tags !== undefined) {
      updateData.tags = {
        set: [],
        connectOrCreate: body.tags.map(name => ({
          where: { name },
          create: { name },
        })),
      };
    }
    
    const image = await prisma.galleryImage.update({
      where: { id },
      data: updateData,
      include: { tags: true },
    });
    
    return image;
  });

  fastify.delete('/:id', {
    onRequest: [fastify.authenticateAdmin],
  }, async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    
    await prisma.galleryImage.delete({ where: { id } });
    
    return { success: true };
  });
}
