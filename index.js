const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');
const projectRoutes = require('./routes/projects');

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Sync database
sequelize.sync({ force: false })
    .then(() => console.log('Database synced successfully'))
    .catch(err => console.error('Error syncing database:', err));

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Protected route
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: `Hello, ${req.user.role}! You have access to this route.` });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
