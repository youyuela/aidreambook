#!/usr/bin/env node

/**
 * 梦境之书OAuth配置验证脚本
 *
 * 使用方法：
 * bun run scripts/verify-oauth.js
 */

async function checkOAuthConfig() {
  console.log(`
🔐 梦境之书 - OAuth配置验证
==========================

本工具将检查Google和GitHub OAuth配置。
`);

  const results = {
    google: { configured: false, valid: false },
    github: { configured: false, valid: false },
    nextauth: { configured: false, valid: false }
  };

  try {
    // 检查NextAuth配置
    console.log('🔍 检查NextAuth配置...');

    const nextAuthUrl = process.env.NEXTAUTH_URL;
    const nextAuthSecret = process.env.NEXTAUTH_SECRET;

    if (!nextAuthUrl) {
      console.log('❌ NEXTAUTH_URL 未配置');
    } else if (nextAuthUrl.includes('localhost') && !nextAuthUrl.startsWith('http://localhost:3000')) {
      console.log('⚠️  NEXTAUTH_URL 可能配置错误:', nextAuthUrl);
    } else {
      console.log('✅ NEXTAUTH_URL 配置正确:', nextAuthUrl);
      results.nextauth.configured = true;
    }

    if (!nextAuthSecret || nextAuthSecret.includes('demo') || nextAuthSecret.length < 16) {
      console.log('❌ NEXTAUTH_SECRET 未配置或不安全');
    } else {
      console.log('✅ NEXTAUTH_SECRET 配置正确');
      results.nextauth.valid = true;
    }

    // 检查Google OAuth
    console.log('\n🔍 检查Google OAuth配置...');

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!googleClientId || googleClientId.includes('your-')) {
      console.log('❌ GOOGLE_CLIENT_ID 未配置');
    } else if (!googleClientId.endsWith('.apps.googleusercontent.com')) {
      console.log('❌ GOOGLE_CLIENT_ID 格式不正确，应该以 .apps.googleusercontent.com 结尾');
    } else {
      console.log('✅ GOOGLE_CLIENT_ID 配置正确');
      results.google.configured = true;
    }

    if (!googleClientSecret || googleClientSecret.includes('your-')) {
      console.log('❌ GOOGLE_CLIENT_SECRET 未配置');
    } else if (googleClientSecret.length < 20) {
      console.log('❌ GOOGLE_CLIENT_SECRET 长度不足，可能配置错误');
    } else {
      console.log('✅ GOOGLE_CLIENT_SECRET 配置正确');
      results.google.valid = true;
    }

    // 检查GitHub OAuth
    console.log('\n🔍 检查GitHub OAuth配置...');

    const githubClientId = process.env.GITHUB_CLIENT_ID;
    const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!githubClientId || githubClientId.includes('your-')) {
      console.log('❌ GITHUB_CLIENT_ID 未配置');
    } else if (githubClientId.length < 16) {
      console.log('❌ GITHUB_CLIENT_ID 长度不足，可能配置错误');
    } else {
      console.log('✅ GITHUB_CLIENT_ID 配置正确');
      results.github.configured = true;
    }

    if (!githubClientSecret || githubClientSecret.includes('your-')) {
      console.log('❌ GITHUB_CLIENT_SECRET 未配置');
    } else if (githubClientSecret.length < 30) {
      console.log('❌ GITHUB_CLIENT_SECRET 长度不足，可能配置错误');
    } else {
      console.log('✅ GITHUB_CLIENT_SECRET 配置正确');
      results.github.valid = true;
    }

    // 生成报告
    console.log('\n📊 OAuth配置报告');
    console.log('==================');

    console.log(`NextAuth: ${results.nextauth.configured && results.nextauth.valid ? '✅ 完全配置' : '❌ 需要配置'}`);
    console.log(`Google OAuth: ${results.google.configured && results.google.valid ? '✅ 完全配置' : results.google.configured ? '⚠️  部分配置' : '❌ 未配置'}`);
    console.log(`GitHub OAuth: ${results.github.configured && results.github.valid ? '✅ 完全配置' : results.github.configured ? '⚠️  部分配置' : '❌ 未配置'}`);

    // 生成配置指南
    if (!(results.google.configured && results.google.valid) || !(results.github.configured && results.github.valid)) {
      console.log('\n📝 配置指南');
      console.log('============');

      if (!(results.google.configured && results.google.valid)) {
        console.log(`
🔧 Google OAuth配置：
1. 前往 https://console.cloud.google.com
2. 创建项目或选择现有项目
3. 启用Google+ API
4. 创建OAuth 2.0客户端ID
5. 配置回调URL: ${nextAuthUrl || 'https://yourdomain.com'}/api/auth/callback/google
6. 将客户端ID和密钥添加到环境变量
`);
      }

      if (!(results.github.configured && results.github.valid)) {
        console.log(`
🔧 GitHub OAuth配置：
1. 前往 https://github.com/settings/developers
2. 创建New OAuth App
3. 配置回调URL: ${nextAuthUrl || 'https://yourdomain.com'}/api/auth/callback/github
4. 将客户端ID和密钥添加到环境变量
`);
      }

      console.log('\n📚 详细配置指南请查看: OAUTH_SETUP_GUIDE.md');
    }

    // 测试建议
    if (results.google.configured && results.google.valid && results.github.configured && results.github.valid) {
      console.log(`
🎉 OAuth配置完成！
=================

✅ 所有OAuth提供商都已正确配置

🧪 测试步骤：
1. 启动开发服务器: bun dev
2. 访问: ${nextAuthUrl || 'http://localhost:3000'}
3. 点击登录按钮
4. 测试Google登录
5. 测试GitHub登录
6. 确认用户信息正确显示

🚀 生产部署时记得更新回调URL！
`);
    }

    return results;

  } catch (error) {
    console.error('❌ OAuth配置检查失败:', error.message);
    return results;
  }
}

// 运行主函数
if (require.main === module) {
  checkOAuthConfig();
}
