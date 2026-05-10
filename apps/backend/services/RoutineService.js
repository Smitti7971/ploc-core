const routineRepository = require('../repositories/RoutineRepository');
const taskRepository = require('../repositories/TaskRepository');

/**
 * RoutineService
 * Gerencia a lógica de criação de rotinas e a projeção automática de tarefas.
 */
class RoutineService {
    async getUserRoutines(userId) {
        return routineRepository.findAllByUserId(parseInt(userId));
    }

    async createRoutine(userId, data) {
        const uid = parseInt(userId);
        const { name, category, description, config } = data;

        if (!name || !category || !config || !config.days) {
            throw new Error('Dados da rotina incompletos (name, category, config.days são obrigatórios)');
        }

        const routine = await routineRepository.create({
            name,
            category,
            description,
            config,
            userId: uid
        });

        // Projetar tarefas iniciais para as próximas 4 semanas
        await this.projectTasks(routine);

        return routine;
    }

    /**
     * Projeta tarefas no calendário baseadas na configuração da rotina.
     */
    async projectTasks(routine) {
        const { id: routineId, userId, name, category, config } = routine;
        const { days, time, projectionWeeks = 4 } = config;

        const tasksToCreate = [];
        const today = new Date();
        today.setHours(12, 0, 0, 0); // Estabilizar horário para cálculos de data

        // Percorrer os próximos X dias (projectionWeeks * 7)
        for (let i = 0; i < (projectionWeeks * 7); i++) {
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + i);
            
            const dayOfWeek = targetDate.getDay(); // 0 (Dom) a 6 (Sab)
            
            if (days.includes(dayOfWeek)) {
                tasksToCreate.push({
                    name,
                    description: `Tarefa gerada pela rotina: ${name}`,
                    category,
                    scheduledDate: targetDate,
                    scheduledTime: time || "08:00",
                    userId,
                    routineId,
                    priority: 'MEDIA',
                    status: 'PENDENTE'
                });
            }
        }

        // Criar tarefas em lote (ou uma a uma se o repositório não tiver bulk)
        // Como o repositório é simples, vamos criar uma a uma para garantir integridade
        for (const taskData of tasksToCreate) {
            await taskRepository.create(taskData);
        }

        return tasksToCreate.length;
    }

    async getTemplates() {
        return routineRepository.findAllTemplates();
    }

    async adoptTemplate(userId, templateId, customConfig) {
        const template = await routineRepository.findTemplateById(parseInt(templateId));
        if (!template) throw new Error('Template não encontrado');

        const routineData = {
            name: template.name,
            category: template.category,
            description: template.description,
            config: {
                ...template.config,
                ...customConfig // Sobrescreve com os dias/horas escolhidos pelo usuário
            }
        };

        return this.createRoutine(userId, routineData);
    }

    async removeRoutine(userId, routineId) {
        const rid = parseInt(routineId);
        const uid = parseInt(userId);
        const routine = await routineRepository.findById(rid);

        if (!routine || routine.userId !== uid) {
            throw new Error('Acesso negado ou rotina não encontrada');
        }

        return routineRepository.delete(rid);
    }
}

module.exports = new RoutineService();
