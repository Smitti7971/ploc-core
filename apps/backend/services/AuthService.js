const userRepository = require('../repositories/UserRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

/**
 * AuthService
 * Centraliza a lógica de autenticação e segurança.
 */
class AuthService {
    async registerUser({ name, email, password, profilePhoto }) {
        const cleanEmail = email?.trim().toLowerCase();
        const cleanName = name?.trim() || 'Mestre';

        if (!cleanEmail || !password || password.trim() === '') {
            throw new Error('Email e senha válidos são obrigatórios');
        }

        const existingUser = await userRepository.findByEmail(cleanEmail);
        if (existingUser) {
            throw new Error('Usuário já cadastrado com este e-mail');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        return userRepository.create({
            name: cleanName,
            email: cleanEmail,
            password: hashedPassword,
            profilePhoto: profilePhoto || null
        });
    }

    async authenticateUser(email, password) {
        const cleanEmail = email?.trim().toLowerCase();
        const user = await userRepository.findByEmail(cleanEmail);

        if (!user || !user.password) {
            throw new Error('E-mail ou senha incorretos');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('E-mail ou senha incorretos');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            authConfig.jwtSecret,
            { 
                expiresIn: authConfig.jwtExpiration,
                algorithm: authConfig.algorithm 
            }
        );

        // Garantia: Se o usuário não tem stats (usuário antigo), cria agora
        let userStats = user.stats;
        if (!userStats) {
            console.log(`🎁 Inicializando estatísticas para o usuário: ${user.email}`);
            const prisma = require('../config/database');
            userStats = await prisma.userStats.create({
                data: {
                    userId: user.id,
                    level: 1,
                    xp: 0,
                    body: 10,
                    mind: 10,
                    life: 10,
                    freedom: 10,
                    purpose: 10,
                    focoCoins: 0,
                    premiumCoins: 0
                }
            });
        }

        // Mapeia o UserInventory relacional para o formato esperado pelo frontend (mockando o JSON antigo)
        if (user.inventory) {
            let plocState = userStats.plocState || {};
            if (typeof plocState === 'string') {
                try { plocState = JSON.parse(plocState); } catch(e) { plocState = {}; }
            }
            
            const newInventory = [];
            for (const inv of user.inventory) {
                const qtd = inv.quantity || 1;
                for (let i = 0; i < qtd; i++) {
                    let itemType = 'food';
                    if (inv.inventoryItem?.slug === 'water') itemType = 'water';
                    if (inv.inventoryItem?.slug === 'medicine') itemType = 'medicine';

                    newInventory.push({
                        id: `${inv.id}-${i}`,
                        type: itemType,
                        name: inv.inventoryItem?.name || 'Unknown',
                        state: 'fresh',
                        createdAt: new Date(inv.acquiredAt).getTime()
                    });
                }
            }
            console.log(`[AuthService] Mapped ${newInventory.length} items for user ${user.id}`);
            
            plocState.inventory = newInventory;
            userStats.plocState = plocState;
        }

        return {
            token,
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email,
                profilePhoto: user.profilePhoto,
                stats: userStats
            }
        };
    }
}

module.exports = new AuthService();
