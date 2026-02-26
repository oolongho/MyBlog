import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import 'dotenv/config';

import authPlugin from './plugins/auth.js';
import authRoutes from './routes/auth.js';
import visitorRoutes from './routes/visitor.js';
import articleRoutes from './routes/articles.js';
import momentRoutes from './routes/moments.js';
import galleryRoutes from './routes/gallery.js';
import friendRoutes from './routes/friends.js';
import commentRoutes from './routes/comments.js';
import statsRoutes from './routes/stats.js';

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

await fastify.register(cors, {
  origin: true,
  credentials: true,
});

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key',
});

await fastify.register(cookie);

await fastify.register(authPlugin);

await fastify.register(authRoutes, { prefix: '/api/auth' });
await fastify.register(visitorRoutes, { prefix: '/api/visitor' });
await fastify.register(articleRoutes, { prefix: '/api/articles' });
await fastify.register(momentRoutes, { prefix: '/api/moments' });
await fastify.register(galleryRoutes, { prefix: '/api/gallery' });
await fastify.register(friendRoutes, { prefix: '/api/friends' });
await fastify.register(commentRoutes, { prefix: '/api/comments' });
await fastify.register(statsRoutes, { prefix: '/api/stats' });

fastify.get('/api/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
