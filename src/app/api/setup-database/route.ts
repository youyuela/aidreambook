import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🗄️ 开始初始化数据库结构...');

    // 测试数据库连接
    await prisma.$connect();
    console.log('✅ 数据库连接成功');

    // 检查是否已有用户
    const userCount = await prisma.user.count();
    console.log(`📊 当前用户数量: ${userCount}`);

    // 如果没有用户，创建一个测试管理员用户
    if (userCount === 0) {
      const adminUser = await prisma.user.create({
        data: {
          email: 'admin@aidreambook.com',
          name: '系统管理员',
          username: 'admin',
          subscriptionTier: 'EXPERT',
          isExpert: true,
          monthlyQuota: 999999,
          usedQuota: 0,
        }
      });
      console.log('✅ 管理员用户创建成功:', adminUser.email);
    }

    // 获取数据库统计信息
    const stats = {
      users: await prisma.user.count(),
      dreams: await prisma.dream.count(),
    };

    return NextResponse.json({
      success: true,
      message: '数据库初始化成功！🎉',
      stats,
      timestamp: new Date().toISOString(),
      database: '数据库表结构已就绪',
    });

  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      details: '请检查数据库连接字符串和Vercel环境变量配置',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST() {
  return GET(); // POST 请求也使用相同的逻辑
}
