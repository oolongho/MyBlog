import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);
    
    const admin = await prisma.admin.findUnique({
      where: { username: body.username },
    });
    
    if (!admin) {
      return reply.code(401).send({ error: '用户名或密码错误' });
    }
    
    const valid = await bcrypt.compare(body.password, admin.password);
    if (!valid) {
      return reply.code(401).send({ error: '用户名或密码错误' });
    }
    
    const token = fastify.jwt.sign(
      { id: admin.id, role: 'admin' },
      { expiresIn: '24h' }
    );
    
    reply.setCookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60,
      path: '/',
    });
    
    return {
      token,
      user: {
        id: admin.id,
        username: admin.username,
        nickname: admin.nickname,
        avatar: admin.avatar,
      },
    };
  });

  fastify.post('/logout', async (request, reply) => {
    reply.clearCookie('token', { path: '/' });
    return { success: true };
  });

  fastify.get('/profile', {
    onRequest: [fastify.authenticateAdmin],
  }, async (request) => {
    const admin = await prisma.admin.findUnique({
      where: { id: request.user!.id },
      select: { id: true, username: true, nickname: true, avatar: true, email: true },
    });
    return admin;
  });

  fastify.post('/init', async (request, reply) => {
    const count = await prisma.admin.count();
    if (count > 0) {
      return reply.code(400).send({ error: '管理员已存在' });
    }
    
    const body = z.object({
      username: z.string().min(3),
      password: z.string().min(6),
      nickname: z.string().min(1),
    }).parse(request.body);
    
    const hashedPassword = await bcrypt.hash(body.password, 10);
    
    const admin = await prisma.admin.create({
      data: {
        username: body.username,
        password: hashedPassword,
        nickname: body.nickname,
      },
    });
    
    return { id: admin.id, username: admin.username, nickname: admin.nickname };
  });
}
