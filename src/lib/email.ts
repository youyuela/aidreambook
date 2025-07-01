import { Resend } from 'resend';

// 邮件服务配置
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.FROM_EMAIL || 'noreply@aidreambook.com';

// 检查是否配置了邮件服务
const hasValidEmailConfig = resendApiKey &&
  resendApiKey !== "" &&
  resendApiKey !== "re_your-api-key";

const resend = hasValidEmailConfig ? new Resend(resendApiKey) : null;

// 邮件模板接口
interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// 发送邮件的基础函数
async function sendEmail(template: EmailTemplate): Promise<boolean> {
  if (!hasValidEmailConfig || !resend) {
    console.log('邮件服务未配置，跳过发送:', template.subject);
    return false;
  }

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: template.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    console.log('邮件发送成功:', result.data?.id);
    return true;
  } catch (error) {
    console.error('邮件发送失败:', error);
    return false;
  }
}

// 欢迎邮件模板
function createWelcomeEmailTemplate(userName: string, userEmail: string): EmailTemplate {
  return {
    to: userEmail,
    subject: '🌟 欢迎来到梦境之书！',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; overflow: hidden;">
        <div style="padding: 40px; text-align: center;">
          <h1 style="margin: 0 0 20px 0; font-size: 28px;">✨ 欢迎来到梦境之书！</h1>
          <p style="font-size: 18px; margin-bottom: 30px;">亲爱的 ${userName}，</p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            感谢您注册梦境之书！我们很兴奋能够帮助您探索梦境的神奇世界。
          </p>

          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="margin: 0 0 15px 0;">🎯 您的免费版权益包括：</h3>
            <ul style="text-align: left; padding-left: 20px; margin: 0;">
              <li style="margin-bottom: 8px;">每月10次AI生成</li>
              <li style="margin-bottom: 8px;">基础梦境解析</li>
              <li style="margin-bottom: 8px;">标准图片生成</li>
              <li style="margin-bottom: 8px;">社区作品浏览</li>
            </ul>
          </div>

          <a href="${process.env.APP_URL || 'http://localhost:3000'}"
             style="display: inline-block; background: #fff; color: #667eea; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0;">
            🚀 开始创作梦境
          </a>

          <p style="font-size: 14px; margin-top: 30px; opacity: 0.8;">
            如果您有任何问题，请随时联系我们的支持团队。
          </p>
        </div>
      </div>
    `,
    text: `欢迎来到梦境之书！

亲爱的 ${userName}，

感谢您注册梦境之书！我们很兴奋能够帮助您探索梦境的神奇世界。

您的免费版权益包括：
- 每月10次AI生成
- 基础梦境解析
- 标准图片生成
- 社区作品浏览

立即访问：${process.env.APP_URL || 'http://localhost:3000'}

如果您有任何问题，请随时联系我们的支持团队。`
  };
}

// 专家认证申请确认邮件
function createExpertApplicationEmailTemplate(userName: string, userEmail: string): EmailTemplate {
  return {
    to: userEmail,
    subject: '🏆 专家认证申请已收到',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); color: #333; border-radius: 10px; overflow: hidden;">
        <div style="padding: 40px; text-align: center;">
          <h1 style="margin: 0 0 20px 0; font-size: 28px; color: #d35400;">🏆 专家认证申请确认</h1>
          <p style="font-size: 18px; margin-bottom: 30px;">亲爱的 ${userName}，</p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            我们已经收到您的专家认证申请。我们的审核团队将在3-5个工作日内处理您的申请。
          </p>

          <div style="background: rgba(255,255,255,0.7); padding: 20px; border-radius: 8px; margin: 30px 0; color: #333;">
            <h3 style="margin: 0 0 15px 0; color: #d35400;">📋 审核流程：</h3>
            <ol style="text-align: left; padding-left: 20px; margin: 0;">
              <li style="margin-bottom: 8px;">专业背景验证</li>
              <li style="margin-bottom: 8px;">资质文件审核</li>
              <li style="margin-bottom: 8px;">作品集评估</li>
              <li style="margin-bottom: 8px;">专家团队面试（如需要）</li>
            </ol>
          </div>

          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            通过认证后，您将获得专家徽章和特殊权限，包括社区指导权限和优先支持。
          </p>

          <p style="font-size: 14px; margin-top: 30px; opacity: 0.8;">
            我们会通过邮件通知您审核结果。感谢您的耐心等待！
          </p>
        </div>
      </div>
    `,
    text: `专家认证申请确认

亲爱的 ${userName}，

我们已经收到您的专家认证申请。我们的审核团队将在3-5个工作日内处理您的申请。

审核流程：
1. 专业背景验证
2. 资质文件审核
3. 作品集评估
4. 专家团队面试（如需要）

通过认证后，您将获得专家徽章和特殊权限，包括社区指导权限和优先支持。

我们会通过邮件通知您审核结果。感谢您的耐心等待！`
  };
}

// 订阅成功邮件
function createSubscriptionSuccessEmailTemplate(
  userName: string,
  userEmail: string,
  planName: string,
  features: string[]
): EmailTemplate {
  return {
    to: userEmail,
    subject: `🎉 订阅${planName}成功！`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); color: #333; border-radius: 10px; overflow: hidden;">
        <div style="padding: 40px; text-align: center;">
          <h1 style="margin: 0 0 20px 0; font-size: 28px; color: #2c3e50;">🎉 订阅成功！</h1>
          <p style="font-size: 18px; margin-bottom: 30px;">恭喜 ${userName}！</p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            您已成功订阅<strong>${planName}</strong>，现在可以享受更多高级功能了！
          </p>

          <div style="background: rgba(255,255,255,0.8); padding: 20px; border-radius: 8px; margin: 30px 0; color: #333;">
            <h3 style="margin: 0 0 15px 0; color: #2c3e50;">✨ 您的新权益：</h3>
            <ul style="text-align: left; padding-left: 20px; margin: 0;">
              ${features.map(feature => `<li style="margin-bottom: 8px;">${feature}</li>`).join('')}
            </ul>
          </div>

          <a href="${process.env.APP_URL || 'http://localhost:3000'}/dashboard"
             style="display: inline-block; background: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0;">
            🎯 前往仪表板
          </a>

          <p style="font-size: 14px; margin-top: 30px; opacity: 0.8;">
            您可以随时在账户设置中管理您的订阅。
          </p>
        </div>
      </div>
    `,
    text: `订阅${planName}成功！

恭喜 ${userName}！

您已成功订阅${planName}，现在可以享受更多高级功能了！

您的新权益：
${features.map(feature => `- ${feature}`).join('\n')}

前往仪表板：${process.env.APP_URL || 'http://localhost:3000'}/dashboard

您可以随时在账户设置中管理您的订阅。`
  };
}

// 专家认证通过邮件
function createExpertApprovalEmailTemplate(userName: string, userEmail: string): EmailTemplate {
  return {
    to: userEmail,
    subject: '🎓 恭喜！专家认证审核通过',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; overflow: hidden;">
        <div style="padding: 40px; text-align: center;">
          <h1 style="margin: 0 0 20px 0; font-size: 28px;">🎓 恭喜！认证通过</h1>
          <p style="font-size: 18px; margin-bottom: 30px;">专家 ${userName}，</p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            恭喜您通过了梦境之书专家认证！您现在正式成为我们社区的认证专家。
          </p>

          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="margin: 0 0 15px 0;">👑 专家特权：</h3>
            <ul style="text-align: left; padding-left: 20px; margin: 0;">
              <li style="margin-bottom: 8px;">专家徽章显示</li>
              <li style="margin-bottom: 8px;">社区内容审核权限</li>
              <li style="margin-bottom: 8px;">用户创作指导权限</li>
              <li style="margin-bottom: 8px;">优先客服支持</li>
              <li style="margin-bottom: 8px;">专家版订阅折扣</li>
            </ul>
          </div>

          <a href="${process.env.APP_URL || 'http://localhost:3000'}/dashboard"
             style="display: inline-block; background: #f39c12; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0;">
            👑 查看专家权限
          </a>

          <p style="font-size: 14px; margin-top: 30px; opacity: 0.8;">
            感谢您为梦境之书社区带来的专业价值！
          </p>
        </div>
      </div>
    `,
    text: `恭喜！专家认证审核通过

专家 ${userName}，

恭喜您通过了梦境之书专家认证！您现在正式成为我们社区的认证专家。

专家特权：
- 专家徽章显示
- 社区内容审核权限
- 用户创作指导权限
- 优先客服支持
- 专家版订阅折扣

查看专家权限：${process.env.APP_URL || 'http://localhost:3000'}/dashboard

感谢您为梦境之书社区带来的专业价值！`
  };
}

// 导出邮件发送函数
export const emailService = {
  // 发送欢迎邮件
  sendWelcomeEmail: async (userName: string, userEmail: string): Promise<boolean> => {
    const template = createWelcomeEmailTemplate(userName, userEmail);
    return sendEmail(template);
  },

  // 发送专家申请确认邮件
  sendExpertApplicationEmail: async (userName: string, userEmail: string): Promise<boolean> => {
    const template = createExpertApplicationEmailTemplate(userName, userEmail);
    return sendEmail(template);
  },

  // 发送订阅成功邮件
  sendSubscriptionSuccessEmail: async (
    userName: string,
    userEmail: string,
    planName: string,
    features: string[]
  ): Promise<boolean> => {
    const template = createSubscriptionSuccessEmailTemplate(userName, userEmail, planName, features);
    return sendEmail(template);
  },

  // 发送专家认证通过邮件
  sendExpertApprovalEmail: async (userName: string, userEmail: string): Promise<boolean> => {
    const template = createExpertApprovalEmailTemplate(userName, userEmail);
    return sendEmail(template);
  },

  // 检查邮件服务是否可用
  isEmailServiceAvailable: (): boolean => {
    return hasValidEmailConfig;
  }
};

// 导出配置检查函数
export { hasValidEmailConfig };
