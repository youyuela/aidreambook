import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reason, credentials, portfolio, experience, specialization } = await request.json();

    if (!reason || !credentials || !specialization) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 检查用户是否已经是专家
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isExpert: true }
    });

    if (existingUser?.isExpert) {
      return NextResponse.json({ error: 'User is already an expert' }, { status: 400 });
    }

    // 检查是否已有待处理的申请
    const existingApplication = await prisma.expertApplication.findFirst({
      where: {
        userId: session.user.id,
        status: 'PENDING'
      }
    });

    if (existingApplication) {
      return NextResponse.json({ error: 'Application already pending' }, { status: 400 });
    }

    // 创建专家申请
    const application = await prisma.expertApplication.create({
      data: {
        userId: session.user.id,
        reason: `${reason}\n\n专业领域：${specialization}\n\n相关经验：${experience}`,
        credentials,
        portfolio,
        status: 'PENDING',
      }
    });

    // 发送确认邮件给用户
    const userForEmail = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true }
    });

    if (userForEmail) {
      const { emailService } = await import('@/lib/email');
      await emailService.sendExpertApplicationEmail(
        userForEmail.name || '用户',
        userForEmail.email
      );
    }

    return NextResponse.json({
      message: 'Application submitted successfully',
      applicationId: application.id
    });

  } catch (error) {
    console.error('Error submitting expert application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 获取用户的申请历史
    const applications = await prisma.expertApplication.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        createdAt: true,
        reviewedAt: true,
        reviewNotes: true,
      }
    });

    return NextResponse.json(applications);

  } catch (error) {
    console.error('Error fetching expert applications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
