import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const isPublic = searchParams.get('isPublic');

    const where: {
      userId: string;
      status?: string;
      isPublic?: boolean;
    } = {
      userId: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    if (isPublic !== null) {
      where.isPublic = isPublic === 'true';
    }

    const [dreams, total] = await Promise.all([
      prisma.dream.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: {
            select: {
              likes: true,
              comments: true,
            }
          }
        }
      }),
      prisma.dream.count({ where })
    ]);

    const transformedDreams = dreams.map(dream => ({
      id: dream.id,
      title: dream.title,
      content: dream.content,
      status: dream.status,
      createdAt: dream.createdAt.toISOString(),
      updatedAt: dream.updatedAt.toISOString(),
      isPublic: dream.isPublic,
      isPublished: dream.isPublished,
      views: dream.views,
      likes: dream._count.likes,
      comments: dream._count.comments,
      imageUrl: dream.imageUrl,
      videoUrl: dream.videoUrl,
      mood: dream.mood,
      style: dream.style,
    }));

    return NextResponse.json({
      dreams: transformedDreams,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });

  } catch (error) {
    console.error('Error fetching user dreams:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, mood, style, isPublic } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 检查配额
    const { checkAndConsumeQuota } = await import('@/lib/ai-service');
    const canGenerate = await checkAndConsumeQuota(session.user.id);

    if (!canGenerate) {
      return NextResponse.json({ error: 'Quota exceeded' }, { status: 429 });
    }

    const dream = await prisma.dream.create({
      data: {
        userId: session.user.id,
        title,
        content,
        mood: mood || 'mysterious',
        style: style || 'surreal',
        isPublic: isPublic || false,
        status: 'PENDING',
        progress: 0,
      },
    });

    return NextResponse.json(dream);

  } catch (error) {
    console.error('Error creating dream:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
