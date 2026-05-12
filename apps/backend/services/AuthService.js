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

        return {
            token,
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email,
                profilePhoto: user.profilePhoto 
            }
        };
    }
}

module.exports = new AuthService();
