import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const createProject = async (req, res) => {
  const { name } = req.body;
  const user = req.user;

  const projectCount = await Project.countDocuments({ user: user._id });

  if (projectCount >= 4) {
    return res.status(400).json({ message: "Maximum of 4 projects allowed" });
  }

  const project = await Project.create({ name, user: user._id });

  res.status(201).json(project);
};

export const getProjects = async (req, res) => {
  const projects = await Project.find({ user: req.user._id });
  res.json(projects);
};

export const deleteProject = async (req, res) => {
  const project = await Project.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  // Delete all related tasks
  await Task.deleteMany({ project: req.params.id });

  res.json({ message: "Project and its tasks deleted" });
};
