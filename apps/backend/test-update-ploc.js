const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const userId = "c88a0963-b1c5-4f41-8a75-3f6cada878a5";
  
  // Create token
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'ploc_secret_key_2024');
  
  try {
    const res = await fetch('http://localhost:5000/api/users/me/ploc', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        plocState: {
          hunger: 97,
          thirst: 97,
          fatigue: 97,
          spoiledEatenCount: 0,
          mood: 'FELIZ',
          inventory: [{ id: "test", type: "food", name: "Apple", state: "fresh", createdAt: 12345 }],
          lastTickAt: Date.now()
        }
      })
    });
    console.log(await res.json());
  } catch(e) {
    console.error(e.message);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
