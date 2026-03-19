/**
 * 服务器端登录测试脚本
 * 完整模拟登录流程
 * 
 * 运行: node src/lib/erp/test-server-login.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testServerLogin() {
  console.log('========== 服务器端登录测试 ==========\n');

  const username = process.argv[2] || 'superadmin';
  const password = process.argv[3] || '123456';
  
  console.log(`测试参数: 用户名="${username}", 密码="${password}"\n`);

  try {
    // 步骤1: 查询用户
    console.log('步骤1: 查询用户...');
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
      process.exit(1);
    }

    console.log(`✓ 用户存在: ${user.username}`);
    console.log(`  角色: ${user.role}`);
    console.log(`  状态: ${user.status}`);
    console.log(`  密码哈希: ${user.passwordHash.substring(0, 40)}...`);

    // 步骤2: 检查用户状态
    console.log('\n步骤2: 检查用户状态...');
    if (user.status !== 'ACTIVE') {
      console.log(`❌ 用户状态不是ACTIVE: ${user.status}`);
      process.exit(1);
    }
    console.log('✓ 用户状态正常 (ACTIVE)');

    // 步骤3: 验证密码
    console.log('\n步骤3: 验证密码...');
    const isValid = await bcrypt.compare(password, user.passwordHash);
    
    if (isValid) {
      console.log('✓ 密码验证成功!');
      console.log('\n========== 登录测试通过 ==========');
      console.log(`\n✅ 用户 "${username}" 可以使用密码 "${password}" 登录!`);
    } else {
      console.log('❌ 密码验证失败!');
      console.log(`   输入的密码: "${password}"`);
      console.log(`   数据库中的哈希: ${user.passwordHash}`);
      console.log('\n========== 登录测试失败 ==========');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ 测试过程出错:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testServerLogin();
