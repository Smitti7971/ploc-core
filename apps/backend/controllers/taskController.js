const taskService = require('../services/TaskService');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getUserTasks(req.user.id);
    res.json(tasks);
  } catch (error) {
    console.error('❌ Erro ao buscar tarefas:', error);
    res.status(500).json({ error: 'Erro interno ao buscar tarefas' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const newTask = await taskService.createNewTask(req.user.id, req.body);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('❌ Erro ao criar tarefa:', error.message);
    const status = error.message.includes('obrigatório') ? 400 : 500;
    res.status(status).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const taskId = parseInt(id);

  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'ID de tarefa inválido' });
  }

  try {
    const updatedTask = await taskService.updateExistingTask(req.user.id, taskId, req.body);
    res.json(updatedTask);
  } catch (error) {
    console.error('❌ Erro ao atualizar tarefa:', error.message);
    const status = error.message.includes('negado') ? 403 : 500;
    res.status(status).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const taskId = parseInt(id);

  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'ID de tarefa inválido' });
  }

  try {
    await taskService.removeTask(req.user.id, taskId);
    res.json({ message: 'Tarefa removida com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao remover tarefa:', error.message);
    const status = error.message.includes('negado') ? 403 : 500;
    res.status(status).json({ error: error.message });
  }
};
