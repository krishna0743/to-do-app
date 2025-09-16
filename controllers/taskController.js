// controllers/taskController.js

const Task = require('../models/Task');

// GET /api/tasks — get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ due_date: 1 });  // sort by due_date ascending
    return res.json(tasks);
  } catch (err) {
    console.error("Error in getAllTasks:", err);
    return res.status(500).json({ error: 'Server error while getting tasks' });
  }
};

// GET /api/tasks/:id — get single task
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.json(task);
  } catch (err) {
    console.error("Error in getTaskById:", err);
    return res.status(500).json({ error: 'Server error while getting task' });
  }
};

// POST /api/tasks — create a task
const createTask = async (req, res) => {
  try {
    const { title, description, due_date, priority, status } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newTask = new Task({
      title: title.trim(),
      description: description ? description.trim() : '',
      due_date: due_date ? new Date(due_date) : null,
      priority,
      status
    });

    const saved = await newTask.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error("Error in createTask:", err);
    return res.status(500).json({ error: 'Server error while creating task' });
  }
};

// PUT /api/tasks/:id — update a task
const updateTask = async (req, res) => {
  try {
    const { title, description, due_date, priority, status } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (due_date !== undefined) task.due_date = new Date(due_date);
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;

    const updated = await task.save();
    return res.json(updated);
  } catch (err) {
    console.error("Error in updateTask:", err);
    return res.status(500).json({ error: 'Server error while updating task' });
  }
};

// DELETE /api/tasks/:id — delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await task.remove();
    return res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error("Error in deleteTask:", err);
    return res.status(500).json({ error: 'Server error while deleting task' });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
