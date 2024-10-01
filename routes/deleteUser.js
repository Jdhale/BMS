const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Ensure this points to your database configuration

// Render the Delete User form
router.get('/', (req, res) => {
    res.render('deleteuser', { msg: null, error: null });
});

// Handle deleting a user
router.post('/', async (req, res) => {
    const { email } = req.body;

    // Validate email field
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Check if the user exists
        const [existingUser] = await db.query('SELECT * FROM login_register WHERE email = ?', [email]);

        if (existingUser.length === 0) {
            return res.render('deleteuser', { error: 'User not found', msg: null });
        }

        // Delete the user from the database
        await db.query('DELETE FROM login_register WHERE email = ?', [email]);

        // Return success message upon successful deletion
        return res.render('deleteuser', { msg: 'User deleted successfully!', error: null });

    } catch (error) {
        console.error('Error deleting user:', error);
        return res.render('deleteuser', { error: 'Server error. Please try again.', msg: null });
    }
});

module.exports = router;
