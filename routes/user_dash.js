const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Ensure this points to your database configuration
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

// Add user route
router.post('/', async (req, res) => {
    console.log(req.body); // Log the request body for debugging
    const { email, password, name, role, balance } = req.body;

    // Validate input fields
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }
    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }
    if (balance === undefined || isNaN(Number(balance))) {
        return res.status(400).json({ message: 'Balance must be a number' });
    }
    if (Number(balance) < 0) {
        return res.status(400).json({ message: 'Balance must be a non-negative number' });
    }

    if (password.length <= 3) {
        return res.status(400).json({ message: 'Password must be longer than 3 characters' });
    }

    // Validate the role (default to 'user' if not provided)
    const validRoles = ['admin', 'user'];
    const userRole = role && validRoles.includes(role) ? role : 'user';

    try {
        // Check if the user already exists
        const [existingUser] = await db.query('SELECT * FROM login_register WHERE email = ?', [email]);
        
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await db.query(
            'INSERT INTO login_register (email, password, name, role, balance) VALUES (?, ?, ?, ?, ?)',
            [email, hashedPassword, name, userRole, Number(balance)]
        );

        // Return a success message upon successful registration
        return res.status(201).json({ message: 'User added successfully!' });
    } catch (error) {
        console.error('Error adding user:', error); // Log the error for debugging
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
