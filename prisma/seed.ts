import { PrismaClient, GenerationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始初始化数据库...');

  // 创建演示用户
  console.log('👤 创建演示用户...');

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@aidreambook.com' },
    update: {},
    create: {
      email: 'demo@aidreambook.com',
      name: '演示用户',
      username: 'demo-user',
      bio: '这是一个演示账户，用于展示梦境之书的功能',
      language: 'zh',
      theme: 'dark',
      subscriptionTier: 'PRO', // 给演示用户专业版权限
      monthlyQuota: 500,
      usedQuota: 15,
      quotaResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isExpert: false,
    },
  });

  // 创建专家用户
  console.log('🏆 创建专家用户...');

  const expertUser = await prisma.user.upsert({
    where: { email: 'expert@aidreambook.com' },
    update: {},
    create: {
      email: 'expert@aidreambook.com',
      name: '专家导师',
      username: 'dream-expert',
      bio: '资深梦境分析专家，心理学博士，专注于梦境解析和心理健康',
      language: 'zh',
      theme: 'dark',
      subscriptionTier: 'EXPERT',
      monthlyQuota: 999999,
      usedQuota: 0,
      isExpert: true,
      expertVerifiedAt: new Date(),
      expertBadge: 'psychology',
    },
  });

  // 创建标签
  console.log('🏷️  创建标签...');

  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: '飞行梦境' },
      update: {},
      create: {
        name: '飞行梦境',
        description: '与飞行相关的梦境，通常象征自由和超越',
        color: '#3B82F6',
        category: 'symbol',
        usageCount: 25,
      },
    }),
    prisma.tag.upsert({
      where: { name: '水元素' },
      update: {},
      create: {
        name: '水元素',
        description: '海洋、河流、雨水等水相关梦境',
        color: '#06B6D4',
        category: 'element',
        usageCount: 18,
      },
    }),
    prisma.tag.upsert({
      where: { name: '恐惧梦境' },
      update: {},
      create: {
        name: '恐惧梦境',
        description: '包含恐惧、焦虑情绪的梦境',
        color: '#EF4444',
        category: 'emotion',
        usageCount: 12,
      },
    }),
    prisma.tag.upsert({
      where: { name: '超现实' },
      update: {},
      create: {
        name: '超现实',
        description: '具有超现实主义特征的奇幻梦境',
        color: '#8B5CF6',
        category: 'style',
        usageCount: 31,
      },
    }),
  ]);

  // 创建演示梦境作品
  console.log('🌙 创建演示梦境作品...');

  const dreamData = [
    {
      title: '星空下的海洋奇遇',
      content: '昨夜我梦见自己漂浮在一片璀璨的星空海洋中，海水呈现出深邃的紫色，无数发光的水母在我身边游弋。我驾驶着一艘透明的水晶船，船帆由星光编织而成，在这神秘的海域中自由航行。远处传来天籁般的歌声，那是海的女儿在呼唤着什么...',
      mood: 'peaceful',
      style: 'surreal',
      isPublic: true,
      isPublished: true,
      publishedAt: new Date(),
      views: 156,
      status: GenerationStatus.COMPLETED,
      progress: 100,
      imageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1024&h=1024&fit=crop',
      userId: demoUser.id,
      analysis: {
        symbols: [
          { symbol: '海洋', meaning: '潜意识的深度、情感的广阔', significance: 'high' },
          { symbol: '星空', meaning: '希望、指引、无限可能', significance: 'high' },
          { symbol: '水母', meaning: '神秘的生命力、直觉的流动', significance: 'medium' }
        ],
        emotions: [
          { emotion: '平静', intensity: 85 },
          { emotion: '神秘', intensity: 75 },
          { emotion: '自由', intensity: 90 }
        ],
        themes: ['超越与自由', '情感与潜意识', '精神探索'],
        interpretation: '这个梦境反映了您对内心平静和精神自由的渴望。星空海洋象征着无限的可能性和深层的情感世界...',
        psychologicalInsights: [
          '水元素常常与情感流动和清洁净化相关',
          '飞行和漂浮通常代表对自由和突破限制的渴望',
          '透明船只象征着诚实和纯净的心灵状态'
        ],
        recommendations: [
          '建议通过冥想来加深对梦境的理解',
          '多关注内心的情感需求',
          '尝试创意表达来释放内在能量'
        ]
      },
      novel: {
        title: '星海漂流者',
        content: '在那个无月的夜晚，海莉娜发现自己置身于一个前所未见的世界...',
        wordCount: 1247,
        genre: '奇幻冒险',
        mood: 'peaceful'
      }
    },
    {
      title: '时空隧道中的追逐',
      content: '我发现自己在一个不断变化的时空隧道中奔跑，身后有一个模糊的黑影在追赶我。隧道的墙壁上闪现着我人生中的各种片段，有童年的快乐时光，也有成年后的压力时刻。我越跑越快，但那个影子始终紧随其后，直到我意识到那个影子其实就是我自己...',
      mood: 'mysterious',
      style: 'abstract',
      isPublic: true,
      isPublished: true,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      views: 89,
      status: GenerationStatus.COMPLETED,
      progress: 100,
      imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093c7d1a?w=1024&h=1024&fit=crop',
      userId: expertUser.id,
      analysis: {
        symbols: [
          { symbol: '追逐', meaning: '内心冲突、逃避心理', significance: 'high' },
          { symbol: '隧道', meaning: '人生路径、转换过程', significance: 'medium' },
          { symbol: '影子', meaning: '内心阴暗面、被压抑的自我', significance: 'high' }
        ],
        emotions: [
          { emotion: '恐惧', intensity: 70 },
          { emotion: '困惑', intensity: 80 },
          { emotion: '觉醒', intensity: 65 }
        ],
        themes: ['自我认知', '内心冲突', '成长转变'],
        interpretation: '这个梦境揭示了您正在经历重要的自我认知过程。追逐场景通常反映现实中的压力或逃避心理...',
        psychologicalInsights: [
          '追逐梦境往往反映现实中的压力或逃避心理',
          '时空隧道象征人生的转换期和成长过程',
          '影子代表需要面对和整合的内在部分'
        ],
        recommendations: [
          '建议正视内心的恐惧和焦虑',
          '通过自我反思来理解内在冲突',
          '寻求专业心理咨询的帮助'
        ]
      },
      novel: {
        title: '影子游戏',
        content: '马克从未想过，自己会在梦中遇见另一个自己...',
        wordCount: 1156,
        genre: '心理悬疑',
        mood: 'mysterious'
      }
    },
    {
      title: '魔法森林的邂逅',
      content: '在一个充满魔力的古老森林中，我遇到了一只会说话的白鹿。它的眼中闪烁着智慧的光芒，告诉我这片森林隐藏着我内心最深的秘密。我们一起穿越了发光的蘑菇圈，走过了歌唱的小溪，最终来到了一棵巨大的世界树前。树上结满了发光的果实，每一颗都蕴含着一个美好的愿望...',
      mood: 'fantasy',
      style: 'artistic',
      isPublic: true,
      isPublished: true,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      views: 234,
      status: GenerationStatus.COMPLETED,
      progress: 100,
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1024&h=1024&fit=crop',
      userId: demoUser.id,
      analysis: {
        symbols: [
          { symbol: '森林', meaning: '未知的探索、内心的迷茫', significance: 'high' },
          { symbol: '白鹿', meaning: '智慧引导、精神向导', significance: 'high' },
          { symbol: '世界树', meaning: '生命力、连接、成长', significance: 'medium' }
        ],
        emotions: [
          { emotion: '好奇', intensity: 90 },
          { emotion: '敬畏', intensity: 85 },
          { emotion: '希望', intensity: 95 }
        ],
        themes: ['精神探索', '内在智慧', '成长觉醒'],
        interpretation: '这是一个充满正能量的成长梦境，反映了您对智慧和精神成长的渴望...',
        psychologicalInsights: [
          '森林代表探索未知和内心世界的愿望',
          '动物向导通常象征内在智慧的显现',
          '世界树是生命力和连接性的强大象征'
        ],
        recommendations: [
          '保持对新事物的好奇心和探索精神',
          '信任自己的直觉和内在智慧',
          '积极追求个人成长和精神发展'
        ]
      },
      novel: {
        title: '森林守护者',
        content: '艾莉亚踏入森林的那一刻，就知道这里与众不同...',
        wordCount: 1089,
        genre: '奇幻魔法',
        mood: 'fantasy'
      }
    }
  ];

  const dreams = await Promise.all(
    dreamData.map(data =>
      prisma.dream.create({
        data: data
      })
    )
  );

  // 为梦境添加标签关联
  console.log('🔗 添加标签关联...');

  // 为梦境添加标签（逐个创建，避免SQLite限制）
  try {
    await prisma.dreamTag.create({
      data: { dreamId: dreams[0].id, tagId: tags.find(t => t.name === '水元素')!.id }
    });
  } catch (e) { /* 忽略重复 */ }

  try {
    await prisma.dreamTag.create({
      data: { dreamId: dreams[0].id, tagId: tags.find(t => t.name === '超现实')!.id }
    });
  } catch (e) { /* 忽略重复 */ }

  try {
    await prisma.dreamTag.create({
      data: { dreamId: dreams[1].id, tagId: tags.find(t => t.name === '恐惧梦境')!.id }
    });
  } catch (e) { /* 忽略重复 */ }

  try {
    await prisma.dreamTag.create({
      data: { dreamId: dreams[2].id, tagId: tags.find(t => t.name === '超现实')!.id }
    });
  } catch (e) { /* 忽略重复 */ }

  // 创建一些点赞
  console.log('❤️  添加互动数据...');

  // 创建点赞（逐个创建）
  try {
    await prisma.like.create({
      data: { userId: expertUser.id, dreamId: dreams[0].id }
    });
  } catch (e) { /* 忽略重复 */ }

  try {
    await prisma.like.create({
      data: { userId: demoUser.id, dreamId: dreams[1].id }
    });
  } catch (e) { /* 忽略重复 */ }

  try {
    await prisma.like.create({
      data: { userId: expertUser.id, dreamId: dreams[2].id }
    });
  } catch (e) { /* 忽略重复 */ }

  // 创建评论（逐个创建）
  try {
    await prisma.comment.create({
      data: {
        userId: expertUser.id,
        dreamId: dreams[0].id,
        content: '这是一个非常美丽的梦境！水元素和星空的结合体现了您内心对宁静与自由的渴望。'
      }
    });
  } catch (e) { /* 忽略重复 */ }

  try {
    await prisma.comment.create({
      data: {
        userId: demoUser.id,
        dreamId: dreams[1].id,
        content: '感谢分享这个深刻的梦境分析，很有启发性。'
      }
    });
  } catch (e) { /* 忽略重复 */ }

  // 创建收藏夹
  console.log('📚 创建收藏夹...');

  const collection = await prisma.collection.create({
    data: {
      userId: demoUser.id,
      name: '我最喜欢的梦境',
      description: '收藏那些特别有意义和美丽的梦境作品',
      isPublic: true,
    }
  });

  await prisma.collectionDream.create({
    data: {
      collectionId: collection.id,
      dreamId: dreams[0].id,
    }
  });

  // 创建系统设置
  console.log('⚙️  初始化系统设置...');

  await prisma.systemSettings.upsert({
    where: { key: 'site_config' },
    update: {},
    create: {
      key: 'site_config',
      value: {
        siteName: '梦境之书',
        description: 'AI驱动的梦境创作平台',
        version: '1.0.0',
        maintenanceMode: false,
        registrationEnabled: true,
        expertApplicationEnabled: true,
      }
    }
  });

  console.log(`
✅ 数据库初始化完成！

📊 创建的数据：
- 👤 用户: 2 个 (1个普通用户, 1个专家)
- 🌙 梦境作品: ${dreams.length} 个
- 🏷️  标签: ${tags.length} 个
- ❤️  点赞: 3 个
- 💬 评论: 2 个
- 📚 收藏夹: 1 个

🔐 演示账户：
- 普通用户: demo@aidreambook.com
- 专家用户: expert@aidreambook.com

🎯 下一步：启动开发服务器并测试功能
`);
}

main()
  .catch((e) => {
    console.error('❌ 数据库初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
