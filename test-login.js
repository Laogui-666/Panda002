/**
 * 本地测试登录流程
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testLogin() {
  console.log('========== 测试登录流程 ==========\n');

  try {
    // 1. 查询用户
    const username = 'superadmin';
    const password = '123456';
    
    console.log(`尝试登录: 用户名=${username}, 密码=${password}`);
    
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
        status: true,
      },
    });

    if (!user) {
      console.log('❌ 用户不存在!');
      return;
    }

    console.log(`✓ 用户找到: ${user.username} (角色: ${user.role}, 状态: ${user.status})`);
    console.log(`  密码哈希: ${user.passwordHash.substring(0, 30)}...`);

    // 2. 验证密码
    const isValid = await bcrypt.compare(password, user.passwordHash);
    
    if (isValid) {
      console.log('✓ 密码验证成功!');
    } else {
      console.log('❌ 密码验证失败!');
      console.log(`   输入的密码: ${password}`);
      console.log(`   数据库的哈希: ${user.passwordHash}`);
    }

  } catch (error) {
    console.error('测试失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
