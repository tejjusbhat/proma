const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Project = require('../models/Project');

const router = express.Router();

// Create a new project
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, description } = req.body;
        const newProject = await Project.create({
            name,
            description,
            ownerId: req.user.id,
        });
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all projects
router.get('/', authMiddleware, async (req, res) => {
    try {
        const projects = await Project.findAll();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single project by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a project by ID
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { name, description } = req.body;
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        await project.update({ name, description });
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a project by ID
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        await project.destroy();
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
