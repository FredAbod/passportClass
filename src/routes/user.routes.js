const express = require('express');
const router = express.Router();
const { signup, login } = require('../controller/user.controller');
const { isAuthenticated } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', (req, res) => {
    // Add session clearing logic here when you implement sessions
    res.status(200).json({ message: 'Logged out successfully' });
});

router.get('/profile', isAuthenticated, (req, res) => {
    res.json({
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        profilePicture: req.user.profilePicture,
        googleId: req.user.googleId
    });
});

module.exports = router;
