const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function resetPassword() {
  const email = 'smitti.j@gmail.com';
  const newPassword = '123456';
  
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
    console.log(`✅ Senha do usuário ${email} resetada para: ${newPassword}`);
  } catch (e) {
    console.error('❌ Erro ao resetar senha:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
