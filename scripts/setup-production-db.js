#!/usr/bin/env node

/**
 * 梦境之书生产数据库设置脚本
 *
 * 使用方法：
 * DATABASE_URL="your-postgresql-url" bun run scripts/setup-production-db.js
 */

const { exec } = require('child_process');
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

function runCommand(command, env = {}) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 执行: ${command}`);
    exec(command, {
      env: { ...process.env, ...env },
      cwd: require('path').join(__dirname, '..')
    }, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ 错误: ${error.message}`);
        reject(error);
      } else {
        console.log(`✅ 完成: ${stdout}`);
        if (stderr && !stderr.includes('warn')) console.log(`⚠️  警告: ${stderr}`);
        resolve(stdout);
      }
    });
  });
}

async function main() {
  console.log(`
🗃️ 梦境之书 - 生产数据库设置
================================

本工具将帮助您：
1. 配置PostgreSQL生产数据库
2. 运行数据库迁移
3. 添加初始数据
4. 验证数据库连接

请确保您已经：
✅ 创建了PostgreSQL数据库
✅ 获取了数据库连接字符串
`);

  try {
    // 检查数据库URL
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      console.log('❌ 请设置DATABASE_URL环境变量');
      console.log('示例: DATABASE_URL="postgresql://user:pass@host:port/db" bun run scripts/setup-production-db.js');
      process.exit(1);
    }

    if (!databaseUrl.startsWith('postgresql://')) {
      console.log('❌ DATABASE_URL必须是PostgreSQL连接字符串');
      process.exit(1);
    }

    console.log('✅ 检测到PostgreSQL数据库连接');

    // 设置环境变量
    const envVars = {
      DATABASE_URL: databaseUrl,
      DATABASE_PROVIDER: 'postgresql'
    };

    // 生成Prisma客户端
    console.log('\n📦 生成Prisma客户端...');
    await runCommand('bunx prisma generate', envVars);

    // 推送数据库结构
    console.log('\n🗃️ 推送数据库结构...');
    await runCommand('bunx prisma db push', envVars);

    // 询问是否添加种子数据
    const addSeed = await question('\n是否添加演示数据？(y/n): ');

    if (addSeed.toLowerCase() === 'y') {
      console.log('\n🌱 添加种子数据...');
      await runCommand('bun tsx prisma/seed.ts', envVars);
    }

    // 验证数据库
    console.log('\n🔍 验证数据库连接...');
    await runCommand('bunx prisma db execute --stdin', {
      ...envVars,
      input: 'SELECT COUNT(*) FROM "User";'
    });

    console.log(`
🎉 生产数据库设置完成！
========================

✅ 数据库连接：正常
✅ 数据表：已创建
✅ 种子数据：${addSeed.toLowerCase() === 'y' ? '已添加' : '跳过'}

📊 数据库信息：
- 类型：PostgreSQL
- URL：${databaseUrl.replace(/:\/\/[^@]+@/, '://***:***@')}

🚀 下一步：
1. 配置生产环境变量
2. 部署应用到Vercel
3. 测试应用功能

📝 在生产环境中设置以下环境变量：
DATABASE_PROVIDER=postgresql
DATABASE_URL=${databaseUrl}
`);

  } catch (error) {
    console.error(`\n❌ 数据库设置失败: ${error.message}`);
    console.log('\n🔧 故障排除：');
    console.log('1. 检查数据库连接字符串格式');
    console.log('2. 确认数据库服务正常运行');
    console.log('3. 检查网络连接和防火墙设置');
    console.log('4. 验证用户权限');
  } finally {
    rl.close();
  }
}

// 运行主函数
if (require.main === module) {
  main();
}
