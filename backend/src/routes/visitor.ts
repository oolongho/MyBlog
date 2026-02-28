import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

const registerSchema = z.object({
  nickname: z.string().min(1).max(20),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default async function visitorRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request, reply) => {
    const body = registerSchema.parse(request.body);
    
    const existing = await prisma.visitor.findUnique({
      where: { email: body.email },
    });
    
    if (existing) {
      return reply.code(400).send({ error: '邮箱已被注册' });
    }
    
    const hashedPassword = await bcrypt.hash(body.password, 10);
    
    const visitor = await prisma.visitor.create({
      data: {
        nickname: body.nickname,
        email: body.email,
        password: hashedPassword,
      },
    });
    
    const token = fastify.jwt.sign(
      { id: visitor.id, role: 'visitor' },
      { expiresIn: '7d' }
    );
    
    reply.setCookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });
    
    return {
      token,
      user: {
        id: visitor.id,
        nickname: visitor.nickname,
        email: visitor.email,
        avatar: visitor.avatar,
      },
    };
  });

  fastify.post('/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);
    
    const visitor = await prisma.visitor.findUnique({
      where: { email: body.email },
    });
    
    if (!visitor || !visitor.password) {
      return reply.code(401).send({ error: '邮箱或密码错误' });
    }
    
    const valid = await bcrypt.compare(body.password, visitor.password);
    if (!valid) {
      return reply.code(401).send({ error: '邮箱或密码错误' });
    }
    
    await prisma.visitor.update({
      where: { id: visitor.id },
      data: { lastLoginAt: new Date() },
    });
    
    const token = fastify.jwt.sign(
      { id: visitor.id, role: 'visitor' },
      { expiresIn: '7d' }
    );
    
    reply.setCookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });
    
    return {
      token,
      user: {
        id: visitor.id,
        nickname: visitor.nickname,
        email: visitor.email,
        avatar: visitor.avatar,
      },
    };
  });

  fastify.get('/profile', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    if (request.user!.role !== 'visitor') {
      return reply.code(403).send({ error: '无权限' });
    }
    
    const visitor = await prisma.visitor.findUnique({
      where: { id: request.user!.id },
      select: { id: true, nickname: true, email: true, avatar: true, createdAt: true },
    });
    return visitor;
  });

  fastify.put('/profile', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    if (request.user!.role !== 'visitor') {
      return reply.code(403).send({ error: '无权限' });
    }
    
    const body = z.object({
      nickname: z.string().min(1).max(20).optional(),
      avatar: z.string().url().optional(),
    }).parse(request.body);
    
    const visitor = await prisma.visitor.update({
      where: { id: request.user!.id },
      data: body,
      select: { id: true, nickname: true, email: true, avatar: true },
    });
    
    return visitor;
  });

  fastify.put('/password', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    if (request.user!.role !== 'visitor') {
      return reply.code(403).send({ error: '无权限' });
    }
    
    const body = z.object({
      oldPassword: z.string().min(6),
      newPassword: z.string().min(6),
    }).parse(request.body);
    
    const visitor = await prisma.visitor.findUnique({
      where: { id: request.user!.id },
      select: { id: true, password: true },
    });
    
    if (!visitor || !visitor.password) {
      return reply.code(400).send({ error: '账户异常' });
    }
    
    const valid = await bcrypt.compare(body.oldPassword, visitor.password);
    if (!valid) {
      return reply.code(400).send({ error: '旧密码错误' });
    }
    
    const hashedPassword = await bcrypt.hash(body.newPassword, 10);
    
    await prisma.visitor.update({
      where: { id: request.user!.id },
      data: { password: hashedPassword },
    });
    
    return { success: true };
  });
}
