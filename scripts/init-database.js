const { execSync } = require('child_process');

async function initDatabase() {
  console.log('🗄️  初始化数据库结构...');

  try {
    // 生成Prisma客户端
    console.log('📦 生成Prisma客户端...');
    execSync('bunx prisma generate', { stdio: 'inherit' });

    // 推送数据库结构
    console.log('🚀 推送数据库结构到PostgreSQL...');
    execSync('bunx prisma db push', { stdio: 'inherit' });

    // 运行种子数据
    console.log('🌱 添加示例数据...');
    execSync('bunx prisma db seed', { stdio: 'inherit' });

    console.log('✅ 数据库初始化完成！');
    console.log('');
    console.log('🎯 下一步：');
    console.log('1. 在Vercel中添加环境变量');
    console.log('2. 重新部署应用');
    console.log('3. 测试网站功能');

  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
    console.log('');
    console.log('💡 请检查：');
    console.log('1. DATABASE_URL 环境变量是否正确');
    console.log('2. 数据库是否可以连接');
    console.log('3. 网络连接是否正常');
  }
}

initDatabase();
