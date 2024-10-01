const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Ensure this points to the updated config

// User registration route
router.post('/', async (req, res) => {
    const { email, password, name, role, balance } = req.body;

    // Validate input fields
    if (!email || !password || !name || balance === undefined) {
        return res.status(400).json({ message: 'All fields including balance are required' });
    }

    if (password.length <= 3) {
        return res.render('register', { error: 'Password must be longer than 3 characters' });
    }

    // Validate the role (default to 'user' if not provided)
    const validRoles = ['admin', 'user'];
    const userRole = role && validRoles.includes(role) ? role : 'user';

    // Validate the balance (ensure it's a positive number)
    const userBalance = parseFloat(balance);
    if (isNaN(userBalance) || userBalance < 0) {
        return res.render('register', { error: 'Balance must be a valid positive number' });
    }

    try {
        // Insert the new user into the database using async/await
        const [result] = await db.query(
            "INSERT INTO login_register (email, password, name, role, balance) VALUES (?, ?, ?, ?, ?)",
            [email, password, name, userRole, userBalance] // Include balance here
        );

        // If the query succeeds, redirect to the login page
        return res.redirect('/login');
        
    } catch (err) {
        // Check if the error is due to duplicate email entry
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Handle any other database errors
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error', error: err.message });
    }
});

module.exports = router;
