import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

const defaultSettings: Record<string, string> = {
  siteTitle: 'My Blog',
  siteDescription: '一个基于 React + Fastify + SQLite 的个人博客系统',
  siteKeywords: '博客,技术,分享',
  footerText: '',
  announcement: '',
  profileNickname: 'oolongho',
  profileTitle: '前端开发者 / 技术爱好者',
  profileBio: '你好！我是 oolongho，一个热爱技术、热爱生活的开发者。\n\n我喜欢学习新技术，尤其对前端开发充满热情。在这个博客里，我会分享我的技术学习心得、生活感悟，以及一些有趣的项目。\n\n如果你对我的文章感兴趣，欢迎留言交流！',
  profileSkills: '前端开发,React,TypeScript',
  profileHobbies: 'Minecraft,音乐,Java,守望先锋,编程,游戏,动漫,摄影',
  profileSocialLinks: '[{"name":"GitHub","icon":"simple-icons:github","url":"https://github.com/oolongho"},{"name":"哔哩哔哩","icon":"streamline-ultimate:bilibili-logo","url":"https://space.bilibili.com/59425300"}]',
  timelineItems: '[{"year":"2024","title":"开始搭建个人博客","description":"使用 React + TypeScript + Tailwind CSS 搭建了这个博客"},{"year":"2023","title":"深入学习前端技术","description":"专注于 React 生态系统，学习 TypeScript 和现代前端工具链"},{"year":"2022","title":"开始学习编程","description":"从零开始学习编程，发现了对前端开发的热爱"}]',
  footerSiteName: 'My Blog',
  footerDescription: '一个简洁的个人博客，记录生活、分享技术。',
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
      'siteTitle', 'siteDescription', 'siteKeywords',
      'footerText', 'announcement',
      'profileNickname', 'profileTitle', 'profileBio', 'profileSkills',
      'profileHobbies', 'profileSocialLinks', 'timelineItems',
      'footerSiteName', 'footerDescription',
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
