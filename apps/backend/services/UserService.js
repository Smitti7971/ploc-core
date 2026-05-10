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
