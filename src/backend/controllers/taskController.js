const prisma = require('../prismaClient');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
};

exports.createTask = async (req, res) => {
  const { name, category } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
        name,
        category,
        userId: req.user.id
      }
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
};

exports.toggleTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });
    
    if (!task || task.userId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { 
        completed: !task.completed,
        completedAt: !task.completed ? new Date() : null
      }
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });
    
    if (!task || task.userId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await prisma.task.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Tarefa removida' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover tarefa' });
  }
};
