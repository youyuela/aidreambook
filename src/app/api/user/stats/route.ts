import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // 获取用户的基本统计
    const [
      totalDreams,
      totalViews,
      totalLikes,
      totalComments,
      user
    ] = await Promise.all([
      prisma.dream.count({
        where: { userId }
      }),
      prisma.dream.aggregate({
        where: { userId },
        _sum: { views: true }
      }),
      prisma.like.count({
        where: {
          dream: { userId }
        }
      }),
      prisma.comment.count({
        where: {
          dream: { userId }
        }
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          createdAt: true,
          isExpert: true,
          subscriptionTier: true,
        }
      })
    ]);

    // 计算专家等级（基于创作数量和互动）
    const totalInteractions = totalLikes + totalComments;
    let expertLevel = 1;

    if (totalDreams >= 100 || totalInteractions >= 1000) {
      expertLevel = 5;
    } else if (totalDreams >= 50 || totalInteractions >= 500) {
      expertLevel = 4;
    } else if (totalDreams >= 20 || totalInteractions >= 200) {
      expertLevel = 3;
    } else if (totalDreams >= 5 || totalInteractions >= 50) {
      expertLevel = 2;
    }

    // 获取最近30天的创作趋势
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentActivity = await prisma.dream.groupBy({
      by: ['createdAt'],
      where: {
        userId,
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      _count: true,
    });

    // 获取热门梦境（按点赞数排序）
    const popularDreams = await prisma.dream.findMany({
      where: {
        userId,
        isPublic: true
      },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          }
        }
      },
      orderBy: {
        likes: {
          _count: 'desc'
        }
      },
      take: 5,
    });

    // 获取梦境类型分布
    const moodDistribution = await prisma.dream.groupBy({
      by: ['mood'],
      where: { userId },
      _count: true,
    });

    const styleDistribution = await prisma.dream.groupBy({
      by: ['style'],
      where: { userId },
      _count: true,
    });

    // 计算创作活跃度
    const daysSinceJoined = user ? Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const creationRate = daysSinceJoined > 0 ? (totalDreams / daysSinceJoined).toFixed(2) : '0';

    return NextResponse.json({
      // 基本统计
      totalDreams,
      totalViews: totalViews._sum.views || 0,
      totalLikes,
      totalComments,
      expertLevel,

      // 用户状态
      isExpert: user?.isExpert || false,
      subscriptionTier: user?.subscriptionTier || 'FREE',
      memberSince: user?.createdAt?.toISOString(),

      // 活跃度指标
      creationRate: Number.parseFloat(creationRate),
      totalInteractions,

      // 趋势数据
      recentActivity: recentActivity.map(item => ({
        date: item.createdAt.toISOString().split('T')[0],
        count: item._count,
      })),

      // 热门作品
      popularDreams: popularDreams.map(dream => ({
        id: dream.id,
        title: dream.title,
        likes: dream._count.likes,
        comments: dream._count.comments,
        views: dream.views,
        createdAt: dream.createdAt.toISOString(),
      })),

      // 内容分布
      moodDistribution: moodDistribution.map(item => ({
        mood: item.mood || 'unknown',
        count: item._count,
      })),

      styleDistribution: styleDistribution.map(item => ({
        style: item.style || 'unknown',
        count: item._count,
      })),

      // 成就徽章
      achievements: calculateAchievements({
        totalDreams,
        totalLikes,
        totalViews: totalViews._sum.views || 0,
        expertLevel,
        isExpert: user?.isExpert || false,
        subscriptionTier: user?.subscriptionTier || 'FREE',
      }),
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateAchievements(stats: {
  totalDreams: number;
  totalLikes: number;
  totalViews: number;
  expertLevel: number;
  isExpert: boolean;
  subscriptionTier: string;
}) {
  const achievements = [];

  // 创作成就
  if (stats.totalDreams >= 1) achievements.push({ id: 'first_dream', name: '首次创作', icon: '🌟' });
  if (stats.totalDreams >= 10) achievements.push({ id: 'prolific_dreamer', name: '多产梦想家', icon: '📚' });
  if (stats.totalDreams >= 50) achievements.push({ id: 'master_creator', name: '创作大师', icon: '🎨' });
  if (stats.totalDreams >= 100) achievements.push({ id: 'dream_legend', name: '梦境传奇', icon: '👑' });

  // 社交成就
  if (stats.totalLikes >= 10) achievements.push({ id: 'liked', name: '受欢迎的', icon: '❤️' });
  if (stats.totalLikes >= 100) achievements.push({ id: 'beloved', name: '深受喜爱', icon: '💖' });
  if (stats.totalViews >= 1000) achievements.push({ id: 'viral', name: '病毒传播', icon: '🔥' });

  // 等级成就
  if (stats.expertLevel >= 3) achievements.push({ id: 'experienced', name: '经验丰富', icon: '⭐' });
  if (stats.expertLevel >= 5) achievements.push({ id: 'expert_level', name: '专家级别', icon: '🏆' });

  // 特殊成就
  if (stats.isExpert) achievements.push({ id: 'certified_expert', name: '认证专家', icon: '🎓' });
  if (stats.subscriptionTier !== 'FREE') achievements.push({ id: 'premium_member', name: '高级会员', icon: '💎' });

  return achievements;
}
