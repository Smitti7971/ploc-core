const userRepository = require('../repositories/UserRepository');

/**
 * UserService
 * Gestão de dados de perfil e listagens.
 */
class UserService {
    async listAll() {
        return userRepository.findAll();
    }

    async getProfile(userId) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        return user;
    }

    async updateProfile(userId, data) {
        // Campos que não podem ser alterados diretamente por esta rota
        const { id, password, email, createdAt, updatedAt, ...safeData } = data;
        
        // Converte birthDate para objeto Date se presente
        if (safeData.birthDate) {
            safeData.birthDate = new Date(safeData.birthDate);
        }

        // Remove campos nulos ou indefinidos
        Object.keys(safeData).forEach(key => {
            if (safeData[key] === null || safeData[key] === undefined || safeData[key] === '') {
                delete safeData[key];
            }
        });

        return userRepository.update(userId, safeData);
    }

    async deleteAccount(id) {
        return await userRepository.delete(id);
    }

    async seedTestData() {
        const users = [
            { name: 'Smitti Admin', email: 'admin@ploc.com' },
            { name: 'Ana Silva', email: 'ana@gmail.com' },
            { name: 'Carlos Oliveira', email: 'carlos@outlook.com' },
            { name: 'Beatriz Santos', email: 'beatriz@tech.com' },
            { name: 'Ricardo Lima', email: 'ricardo@startup.io' },
        ];

        for (const user of users) {
            await userRepository.upsert(user.email, user);
        }
        
        return { message: "Banco de dados populado com sucesso! 🚀" };
    }
}

module.exports = new UserService();
