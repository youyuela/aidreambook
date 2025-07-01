import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    console.log('🗄️ 开始初始化数据库结构...');

    // 测试数据库连接
    await prisma.$connect();
    console.log('✅ 数据库连接成功');

    // 推送数据库结构（如果表不存在会自动创建）
    // 注意：在生产环境中，Prisma会自动创建表结构

    // 创建一个测试用户来验证数据库
    const testUser = await prisma.user.upsert({
      where: { email: 'admin@aidreambook.com' },
      update: {},
      create: {
        email: 'admin@aidreambook.com',
        name: '管理员',
        username: 'admin',
        subscriptionTier: 'EXPERT',
        isExpert: true,
        monthlyQuota: 999999,
        usedQuota: 0,
      }
    });

    console.log('✅ 测试用户创建成功:', testUser.email);

    return NextResponse.json({
      success: true,
      message: '数据库初始化成功！',
      testUser: {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name
      }
    });

  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      details: '请检查数据库连接字符串和网络连接'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
