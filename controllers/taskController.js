import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  const { title, description, status, project, priority, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    status: status || "pending",
    priority: priority || "medium",
    dueDate: dueDate || null,
    user: req.user._id,
    project,
  });

  res.status(201).json(task);
};

export const getTasks = async (req, res) => {
  const { projectId } = req.query;
  const filter = { user: req.user._id };
  if (projectId) filter.project = projectId;

  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.json(tasks);
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, dueDate } = req.body;

  const task = await Task.findOne({ _id: id, user: req.user._id });
  if (!task) return res.status(404).json({ message: "Task not found" });

  task.title = title || task.title;
  task.description = description || task.description;
  task.status = status || task.status;
  task.completedAt = status === "completed" ? new Date() : null;
  task.priority = priority || task.priority;
  task.dueDate = dueDate || task.dueDate;

  await task.save();
  res.json(task);
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });
  if (!task) return res.status(404).json({ message: "Task not found" });

  res.json({ message: "Task deleted" });
};
