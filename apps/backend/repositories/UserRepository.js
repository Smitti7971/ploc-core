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
            select: { id: true, name: true, email: true, createdAt: true }
        });
    }

    async findByEmail(email) {
        return prisma.user.findUnique({
            where: { email }
        });
    }

    async create(data) {
        return prisma.user.create({
            data
        });
    }

    async update(id, data) {
        return await prisma.user.update({
            where: { id },
            data
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
