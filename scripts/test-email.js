#!/usr/bin/env node

/**
 * 梦境之书邮件服务测试脚本
 *
 * 使用方法：
 * bun run scripts/test-email.js your-email@example.com
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function testEmailService() {
  console.log(`
✉️ 梦境之书 - 邮件服务测试
==========================

本工具将测试邮件服务配置并发送测试邮件。
`);

  try {
    // 检查环境变量
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL;

    console.log('🔍 检查邮件服务配置...');

    if (!resendApiKey || resendApiKey.includes('your-')) {
      console.log('❌ RESEND_API_KEY 未配置或使用示例值');
      console.log('请前往 https://resend.com 获取API密钥');
      return false;
    }

    if (!fromEmail || fromEmail.includes('yourdomain')) {
      console.log('❌ FROM_EMAIL 未配置或使用示例值');
      console.log('请设置您的发件邮箱地址');
      return false;
    }

    console.log('✅ 邮件服务配置检查通过');

    // 获取收件人邮箱
    const toEmail = process.argv[2] || await question('请输入测试邮箱地址: ');

    if (!toEmail || !toEmail.includes('@')) {
      console.log('❌ 无效的邮箱地址');
      return false;
    }

    // 动态导入邮件服务
    const { emailService } = await import('../src/lib/email.js');

    if (!emailService.isEmailServiceAvailable()) {
      console.log('❌ 邮件服务不可用');
      return false;
    }

    console.log(`\n📧 发送测试邮件到: ${toEmail}`);

    // 发送欢迎邮件测试
    const success = await emailService.sendWelcomeEmail('测试用户', toEmail);

    if (success) {
      console.log('✅ 测试邮件发送成功！');
      console.log('📬 请检查您的收件箱（包括垃圾邮件文件夹）');
      return true;
    } else {
      console.log('❌ 测试邮件发送失败');
      return false;
    }

  } catch (error) {
    console.error('❌ 邮件测试失败:', error.message);
    return false;
  }
}

async function main() {
  try {
    const success = await testEmailService();

    if (success) {
      console.log(`
🎉 邮件服务测试完成！
====================

✅ 配置检查：通过
✅ 发送测试：成功

📧 邮件服务已准备就绪，可以用于生产环境。

🔧 如果邮件未收到，请检查：
1. 垃圾邮件文件夹
2. Resend API密钥权限
3. 发件域名验证
4. 收件邮箱有效性
`);
    } else {
      console.log(`
❌ 邮件服务测试失败
==================

🔧 请检查以下配置：

1. Resend API密钥 (RESEND_API_KEY)
   - 前往 https://resend.com 获取
   - 确保密钥有发送权限

2. 发件邮箱 (FROM_EMAIL)
   - 使用已验证的域名
   - 格式: noreply@yourdomain.com

3. 环境变量配置
   - 确保 .env.local 中配置正确
   - 重启开发服务器

📚 详细配置指南请查看：
- PRODUCTION_SETUP.md
- https://resend.com/docs
`);
    }
  } catch (error) {
    console.error('测试脚本执行失败:', error);
  } finally {
    rl.close();
  }
}

// 运行主函数
if (require.main === module) {
  main();
}
