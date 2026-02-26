import type { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma.js';

export default async function statsRoutes(fastify: FastifyInstance) {
  fastify.get('/', {
    onRequest: [fastify.authenticateAdmin],
  }, async () => {
    const [articleCount, momentCount, commentCount, friendCount, galleryCount, viewsResult, likesResult] = await Promise.all([
      prisma.article.count(),
      prisma.moment.count(),
      prisma.comment.count(),
      prisma.friendLink.count({ where: { status: 1 } }),
      prisma.galleryImage.count(),
      prisma.article.aggregate({ _sum: { views: true } }),
      prisma.moment.aggregate({ _sum: { likes: true } }),
    ]);
    
    return {
      articleCount,
      momentCount,
      commentCount,
      friendCount,
      galleryCount,
      totalViews: viewsResult._sum.views || 0,
      totalLikes: likesResult._sum.likes || 0,
    };
  });
}
