#!/usr/bin/env node

/**
 * 梦境之书数据库设置脚本
 *
 * 使用方法：
 * 1. bun run scripts/setup-database.js
 * 2. 按照提示输入数据库连接信息
 * 3. 自动运行Prisma迁移
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
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

async function generateSecret() {
  return new Promise((resolve) => {
    exec('openssl rand -base64 32', (error, stdout) => {
      if (error) {
        // 如果openssl不可用，生成一个简单的随机字符串
        resolve(Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2));
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 执行命令: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ 错误: ${error.message}`);
        reject(error);
      } else {
        console.log(`✅ 成功: ${stdout}`);
        if (stderr) console.log(`⚠️  警告: ${stderr}`);
        resolve(stdout);
      }
    });
  });
}

async function main() {
  console.log(`
🌟 欢迎使用梦境之书数据库设置向导！
==========================================

本向导将帮助您：
1. 配置数据库连接
2. 生成安全密钥
3. 运行数据库迁移
4. 验证配置

请确保您已经：
✅ 创建了免费的 PostgreSQL 数据库（推荐 Supabase）
✅ 获取了数据库连接字符串

让我们开始吧！
`);

  try {
    // 询问数据库信息
    console.log('\n📊 数据库配置');
    console.log('─'.repeat(40));

    const hasDatabase = await question('您是否已经创建了数据库？(y/n): ');

    if (hasDatabase.toLowerCase() !== 'y') {
      console.log(`
🎯 推荐的免费数据库服务：

1. Supabase (推荐)
   - 网址：https://supabase.com
   - 免费额度：500MB + 50,000 请求/月
   - 特点：功能最全，管理界面友好

2. Railway
   - 网址：https://railway.app
   - 免费额度：512MB
   - 特点：部署简单

3. Neon
   - 网址：https://neon.tech
   - 免费额度：512MB
   - 特点：自动扩缩容

请前往以上任一服务创建数据库，然后重新运行此脚本。
`);
      process.exit(0);
    }

    const databaseUrl = await question('\n请输入数据库连接字符串 (DATABASE_URL): ');

    if (!databaseUrl || !databaseUrl.startsWith('postgresql://')) {
      console.log('❌ 数据库连接字符串格式不正确！');
      console.log('正确格式: postgresql://username:password@host:port/database');
      process.exit(1);
    }

    // 生成NextAuth密钥
    console.log('\n🔐 生成安全密钥...');
    const nextAuthSecret = await generateSecret();

    // 更新环境变量
    console.log('\n📝 更新环境变量...');
    const envPath = path.join(__dirname, '..', '.env.local');
    let envContent = fs.readFileSync(envPath, 'utf8');

    // 替换数据库URL
    envContent = envContent.replace(
      /DATABASE_URL=.*/,
      `DATABASE_URL="${databaseUrl}"`
    );

    // 替换NextAuth密钥
    envContent = envContent.replace(
      /NEXTAUTH_SECRET=.*/,
      `NEXTAUTH_SECRET="${nextAuthSecret}"`
    );

    fs.writeFileSync(envPath, envContent);
    console.log('✅ 环境变量已更新');

    // 运行Prisma命令
    console.log('\n🗃️  配置数据库...');

    // 生成Prisma客户端
    await runCommand('cd ' + path.join(__dirname, '..') + ' && bun prisma generate');

    // 推送数据库结构
    console.log('\n📤 推送数据库结构...');
    await runCommand('cd ' + path.join(__dirname, '..') + ' && bun prisma db push');

    // 验证连接
    console.log('\n🔍 验证数据库连接...');
    await runCommand('cd ' + path.join(__dirname, '..') + ' && bun prisma db seed');

    console.log(`
🎉 数据库配置完成！
==========================================

✅ 数据库连接：已配置
✅ 安全密钥：已生成
✅ 数据表：已创建
✅ 连接测试：通过

🚀 下一步：
1. 启动开发服务器：bun dev
2. 访问：http://localhost:3000
3. 测试用户注册和登录功能
4. 开始创建您的第一个梦境作品！

📚 更多配置：
- 配置 OAuth 登录（Google/GitHub）
- 配置 OpenAI API 密钥（AI功能）
- 配置 Stripe 支付（订阅功能）

查看 .env.local 文件获取详细配置说明。
`);

  } catch (error) {
    console.error(`\n❌ 设置失败: ${error.message}`);
    console.log('\n🔧 故障排除：');
    console.log('1. 检查数据库连接字符串是否正确');
    console.log('2. 检查网络连接');
    console.log('3. 检查数据库服务是否正常运行');
    console.log('4. 查看详细错误信息并联系支持');
  } finally {
    rl.close();
  }
}

// 运行主函数
if (require.main === module) {
  main();
}
