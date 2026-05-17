const prisma = require('../config/database');

/**
 * ProgressionService
 * Motor de gamificação, progresso e economia do PLOC.
 */
class ProgressionService {
    /**
     * Adiciona ou remove atributos de um usuário com rastreabilidade total.
     */
    async updateStat({ userId, statType, amount, sourceType, sourceId, description }) {
        if (amount === 0) return null;

        return prisma.$transaction(async (tx) => {
            // 1. Atualizar o estado atual do usuário
            const updateData = {};
            const statField = this._mapStatToField(statType);
            updateData[statField] = { increment: amount };

            const stats = await tx.userStats.update({
                where: { userId },
                data: updateData
            });

            // 2. Registrar a transação para o histórico
            await tx.statTransaction.create({
                data: {
                    userId,
                    statType,
                    amount,
                    sourceType,
                    sourceId: sourceId ? String(sourceId) : null,
                    description
                }
            });

            // 3. Se for XP, verificar se subiu de nível
            if (statType === 'XP') {
                await this._checkLevelUp(userId, stats.xp, stats.level, tx);
            }

            return stats;
        });
    }

    /**
     * Executa uma rotina, registra o histórico e distribui recompensas.
     */
    async executeRoutine(userId, routineId) {
        return prisma.$transaction(async (tx) => {
            // 1. Buscar a rotina e suas recompensas
            const routine = await tx.routine.findUnique({
                where: { id: routineId },
                include: { rewards: true }
            });

            if (!routine || routine.userId !== userId) {
                throw new Error('Rotina não encontrada ou acesso negado');
            }

            // 2. Registrar a execução
            const execution = await tx.taskExecution.create({
                data: {
                    userId,
                    routineId,
                    status: 'COMPLETED',
                    finishedAt: new Date(),
                    completedOnTime: true // Futuramente comparar com config da rotina
                }
            });

            // 3. Processar Recompensas
            const results = [];
            for (const reward of routine.rewards) {
                const updatedStats = await this.updateStat({
                    userId,
                    statType: reward.statType,
                    amount: reward.amount,
                    sourceType: 'ROUTINE',
                    sourceId: String(routineId),
                    description: `Recompensa pela rotina: ${routine.name}`
                }, tx);
                results.push(updatedStats);
            }

            // 4. Bônus padrão de XP se não houver recompensas específicas
            if (routine.rewards.length === 0) {
                await this.updateStat({
                    userId,
                    statType: 'XP',
                    amount: 10,
                    sourceType: 'ROUTINE',
                    sourceId: String(routineId),
                    description: `XP base pela rotina: ${routine.name}`
                }, tx);
            }

            return { execution, rewardsApplied: routine.rewards.length };
        });
    }

    /**
     * Lógica interna de Level Up
     */
    async _checkLevelUp(userId, currentXp, currentLevel, tx) {
        // Fórmula simples: Level * 100 de XP para o próximo nível
        const nextLevelThreshold = currentLevel * 100;

        if (currentXp >= nextLevelThreshold) {
            const newLevel = currentLevel + 1;
            
            await tx.userStats.update({
                where: { userId },
                data: { 
                    level: newLevel,
                    // Poderíamos dar bônus de moedas aqui
                }
            });

            await tx.statTransaction.create({
                data: {
                    userId,
                    statType: 'XP',
                    amount: 0,
                    sourceType: 'SYSTEM',
                    description: `LEVEL UP! Você alcançou o nível ${newLevel}`
                }
            });
            
            return true;
        }
        return false;
    }

    _mapStatToField(statType) {
        const mapping = {
            'BODY': 'body',
            'MIND': 'mind',
            'LIFE': 'life',
            'FREEDOM': 'freedom',
            'PURPOSE': 'purpose',
            'FOCO_COINS': 'focoCoins',
            'PREMIUM_COINS': 'premiumCoins',
            'XP': 'xp'
        };
        return mapping[statType] || 'xp';
    }
}

module.exports = new ProgressionService();
