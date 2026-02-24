import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { prisma } from '../lib/prisma.js';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authenticateAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export default fp(async function authPlugin(fastify: FastifyInstance) {
  fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const token = request.cookies.token || request.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        reply.code(401).send({ error: '未登录' });
        return;
      }
      const decoded = fastify.jwt.verify<{ id: number; role: string }>(token);
      request.user = decoded;
    } catch (err) {
      reply.code(401).send({ error: '登录已过期' });
    }
  });

  fastify.decorate('authenticateAdmin', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const token = request.cookies.token || request.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        reply.code(401).send({ error: '未登录' });
        return;
      }
      const decoded = fastify.jwt.verify<{ id: number; role: string }>(token);
      if (decoded.role !== 'admin') {
        reply.code(403).send({ error: '无权限' });
        return;
      }
      request.user = decoded;
    } catch (err) {
      reply.code(401).send({ error: '登录已过期' });
    }
  });
});
