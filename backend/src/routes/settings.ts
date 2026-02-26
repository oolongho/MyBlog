import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

const defaultSettings: Record<string, string> = {
  siteTitle: 'My Blog',
  siteDescription: '一个基于 React + Fastify + SQLite 的个人博客系统',
  siteKeywords: '博客,技术,分享',
  siteAuthor: 'oolongho',
  siteAvatar: '',
  siteFavicon: '',
  socialGithub: '',
  socialTwitter: '',
  socialEmail: '',
  footerText: '© 2024 My Blog. All rights reserved.',
  announcement: '',
};

const updateSettingSchema = z.object({
  key: z.string(),
  value: z.string(),
});

const updateSettingsSchema = z.array(updateSettingSchema);

export default async function settingsRoutes(fastify: FastifyInstance) {
  fastify.get('/public', async () => {
    const settings = await prisma.setting.findMany();
    const result: Record<string, string> = { ...defaultSettings };
    
    for (const setting of settings) {
      result[setting.key] = setting.value;
    }
    
    const publicKeys = [
      'siteTitle', 'siteDescription', 'siteKeywords', 'siteAuthor',
      'siteAvatar', 'socialGithub', 'socialTwitter', 'socialEmail',
      'footerText', 'announcement',
    ];
    
    const publicSettings: Record<string, string> = {};
    for (const key of publicKeys) {
      publicSettings[key] = result[key] || '';
    }
    
    return publicSettings;
  });

  fastify.get('/', {
    onRequest: [fastify.authenticateAdmin],
  }, async () => {
    const settings = await prisma.setting.findMany();
    const result: Record<string, string> = { ...defaultSettings };
    
    for (const setting of settings) {
      result[setting.key] = setting.value;
    }
    
    return result;
  });

  fastify.put('/', {
    onRequest: [fastify.authenticateAdmin],
  }, async (request) => {
    const body = updateSettingsSchema.parse(request.body);
    
    await prisma.$transaction(
      body.map(item =>
        prisma.setting.upsert({
          where: { key: item.key },
          update: { value: item.value },
          create: { key: item.key, value: item.value },
        })
      )
    );
    
    return { success: true };
  });

  fastify.put('/:key', {
    onRequest: [fastify.authenticateAdmin],
  }, async (request) => {
    const key = (request.params as { key: string }).key;
    const body = updateSettingSchema.parse(request.body);
    
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value: body.value },
      create: { key, value: body.value },
    });
    
    return setting;
  });
}
