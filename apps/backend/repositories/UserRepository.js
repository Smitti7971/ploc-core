const prisma = require('../config/database');

/**
 * UserRepository
 * Abstração da persistência de dados de usuários.
 */
class UserRepository {
    async findAll() {
        return prisma.user.findMany({
            select: { id: true, name: true, email: true, createdAt: true },
            orderBy: { id: 'asc' }
        });
    }

    async findById(id) {
        return prisma.user.findUnique({
            where: { id },
            include: { 
                stats: true,
                inventory: {
                    include: {
                        inventoryItem: true
                    }
                },
                statTransactions: {
                    take: 10,
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
    }

    async findByEmail(email) {
        return prisma.user.findUnique({
            where: { email },
            include: { 
                stats: true,
                inventory: {
                    include: {
                        inventoryItem: true
                    }
                }
            }
        });
    }

    async create(data) {
        return prisma.user.create({
            data: {
                ...data,
                stats: {
                    create: {} // Inicializa com os valores @default do schema
                }
            },
            include: {
                stats: true
            }
        });
    }

    async update(id, data) {
        return await prisma.user.update({
            where: { id },
            data,
            include: { stats: true }
        });
    }

    async delete(id) {
        return await prisma.user.delete({
            where: { id }
        });
    }

    async upsert(email, data) {
        return prisma.user.upsert({
            where: { email },
            update: {},
            create: data
        });
    }
}

module.exports = new UserRepository();
