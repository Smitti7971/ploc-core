const prisma = require('../config/database');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    console.error('❌ Erro ao buscar tarefas:', error);
    res.status(500).json({ error: 'Erro interno ao buscar tarefas' });
  }
};

exports.createTask = async (req, res) => {
  const { name, description, category, scheduledDate, scheduledTime } = req.body;
  
  const cleanName = name?.trim();
  const cleanCategory = category?.trim() || 'Geral';

  if (!cleanName) {
    return res.status(400).json({ error: 'O nome da tarefa é obrigatório' });
  }

  try {
    const newTask = await prisma.task.create({
      data: {
        name: cleanName,
        description: description?.trim(),
        category: cleanCategory,
        scheduledDate: (scheduledDate && !isNaN(Date.parse(scheduledDate))) ? new Date(scheduledDate) : null,
        scheduledTime,
        userId: req.user.id
      }
    });
    res.status(201).json(newTask);
  } catch (error) {
    console.error('❌ Erro ao criar tarefa:', error);
    res.status(500).json({ error: 'Erro interno ao criar tarefa' });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const taskId = parseInt(id);

  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'ID de tarefa inválido' });
  }

  const { name, description, category, scheduledDate, scheduledTime, completed } = req.body;
  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    
    if (!task || task.userId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado ou tarefa não encontrada' });
    }

    // Lógica para data de conclusão
    let completedAt = undefined;
    if (completed === true) completedAt = new Date();
    if (completed === false) completedAt = null;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { 
        name,
        description,
        category,
        scheduledDate: (scheduledDate && !isNaN(Date.parse(scheduledDate))) ? new Date(scheduledDate) : undefined,
        scheduledTime,
        completed,
        completedAt
      }
    });
    res.json(updatedTask);
  } catch (error) {
    console.error('❌ Erro ao atualizar tarefa:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar tarefa' });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const taskId = parseInt(id);

  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'ID de tarefa inválido' });
  }

  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    
    if (!task || task.userId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado ou tarefa não encontrada' });
    }

    await prisma.task.delete({ where: { id: taskId } });
    res.json({ message: 'Tarefa removida com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao remover tarefa:', error);
    res.status(500).json({ error: 'Erro interno ao remover tarefa' });
  }
};
