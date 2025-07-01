#!/usr/bin/env node

/**
 * 梦境之书OpenAI API测试脚本
 *
 * 使用方法：
 * bun run scripts/test-openai.js
 */

async function testOpenAIAPI() {
  console.log(`
🤖 梦境之书 - OpenAI API测试
===========================

本工具将测试OpenAI API配置并执行简单的AI生成。
`);

  try {
    // 检查环境变量
    const apiKey = process.env.OPENAI_API_KEY;
    const orgId = process.env.OPENAI_ORG_ID;

    console.log('🔍 检查OpenAI API配置...');

    if (!apiKey || apiKey.includes('your-')) {
      console.log('❌ OPENAI_API_KEY 未配置或使用示例值');
      console.log('请前往 https://platform.openai.com/api-keys 获取API密钥');
      return false;
    }

    if (!apiKey.startsWith('sk-')) {
      console.log('❌ OPENAI_API_KEY 格式不正确，应该以 sk- 开头');
      return false;
    }

    console.log('✅ OPENAI_API_KEY 格式正确');

    if (orgId && !orgId.startsWith('org-')) {
      console.log('⚠️  OPENAI_ORG_ID 格式可能不正确，应该以 org- 开头');
    }

    // 测试API连接
    console.log('\n🔗 测试API连接...');

    const OpenAI = await import('openai').then(m => m.default);
    const openai = new OpenAI({
      apiKey: apiKey,
      organization: orgId,
    });

    // 测试简单的文本生成
    console.log('📝 测试文本生成...');

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: '请简单回复"API测试成功"'
        }
      ],
      max_tokens: 10,
    });

    const response = completion.choices[0]?.message?.content || '';
    console.log('✅ GPT响应:', response);

    // 测试DALL-E（如果可用）
    console.log('\n🎨 测试图片生成...');

    try {
      const imageResponse = await openai.images.generate({
        model: 'dall-e-2',
        prompt: 'A simple test image of a star',
        n: 1,
        size: '256x256',
      });

      if (imageResponse.data[0]?.url) {
        console.log('✅ DALL-E图片生成成功');
        console.log('🖼️  图片URL:', imageResponse.data[0].url);
      }
    } catch (error) {
      console.log('⚠️  DALL-E测试失败（可能需要升级账户）:', error.message);
    }

    return true;

  } catch (error) {
    console.error('❌ OpenAI API测试失败:', error.message);

    if (error.code === 'invalid_api_key') {
      console.log('🔧 API密钥无效，请检查：');
      console.log('1. 密钥是否正确复制');
      console.log('2. 密钥是否已激活');
      console.log('3. 账户是否有足够余额');
    } else if (error.code === 'insufficient_quota') {
      console.log('🔧 API配额不足，请检查：');
      console.log('1. 账户余额');
      console.log('2. 使用限制');
      console.log('3. 计费设置');
    }

    return false;
  }
}

async function main() {
  try {
    const success = await testOpenAIAPI();

    if (success) {
      console.log(`
🎉 OpenAI API测试完成！
======================

✅ API密钥：有效
✅ 连接测试：成功
✅ 文本生成：正常

🚀 AI功能已准备就绪！

📊 用量建议：
- 监控API使用量
- 设置使用限制
- 定期检查账户余额

🔧 生产环境配置：
- 考虑使用GPT-4获得更好效果
- 配置错误处理和重试机制
- 实现内容过滤和安全检查
`);
    } else {
      console.log(`
❌ OpenAI API测试失败
====================

🔧 请检查以下配置：

1. API密钥 (OPENAI_API_KEY)
   - 前往 https://platform.openai.com/api-keys
   - 创建新的API密钥
   - 确保密钥格式为 sk-xxx

2. 账户状态
   - 检查账户余额
   - 确认账户已激活
   - 检查使用限制

3. 网络连接
   - 确保可以访问OpenAI API
   - 检查防火墙设置

📚 详细配置指南：
- PRODUCTION_SETUP.md
- https://platform.openai.com/docs
`);
    }
  } catch (error) {
    console.error('测试脚本执行失败:', error);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}
