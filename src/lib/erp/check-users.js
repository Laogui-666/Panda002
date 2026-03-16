/**
 * 检查数据库中的用户
 * 运行命令: node src/lib/erp/check-users.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('========== 检查数据库用户 ==========\n');

  try {
    // 查询所有用户
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        status: true,
        passwordHash: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    console.log(`共 ${users.length} 个用户:\n`);
    
    for (const user of users) {
      console.log(`----------------------------------------`);
      console.log(`ID: ${user.id}`);
      console.log(`用户名: ${user.username}`);
      console.log(`邮箱: ${user.email}`);
      console.log(`姓名: ${user.name}`);
      console.log(`角色: ${user.role}`);
      console.log(`状态: ${user.status}`);
      console.log(`密码哈希: ${user.passwordHash ? user.passwordHash.substring(0, 20) + '...' : '无'}`);
      console.log(`创建时间: ${user.createdAt}`);
      console.log(`最后登录: ${user.lastLoginAt}`);
    }

    console.log('\n========== 用户检查完成 ==========');
    console.log('\n提示: 如果密码不正确，可以运行 init-db.js 重新初始化');

  } catch (error) {
    console.error('检查失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
