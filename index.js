require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/user.routes');
const authRoutes = require('./src/routes/auth.routes');
const passport = require('passport');
require('./src/config/passport.setup');
const { isAuthenticated } = require('./src/middleware/auth');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use(express.static(path.join(__dirname, 'src/views')));

// Routes
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);

// View routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/home.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/login.html'));
});

app.get('/dashboard', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/dashboard.html'));
});

// Server setup
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
