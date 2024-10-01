const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Make sure this points to your promise-based db config

// Handle login form submission
router.post('/', async (req, res) => {
    const email = req.body.lemail;
    const password = req.body.lpassword;

    try {
        // Special check for admin login
        if (email === 'admin@admin.com' && password === 'admin') {
            req.session.email = email; // Store admin email in session
            return res.redirect('/admin_dash'); // Redirect to admin dashboard
        }

        // Query the database for other users
        const [results] = await db.query('SELECT * FROM login_register WHERE email = ? AND password = ?', [email, password]);

        if (results.length > 0) {
            // Successful login
            req.session.email = email; // Store user email in session
            return res.redirect('/user_dash'); // Redirect to normal user dashboard
        } else {
            // No match found, invalid login
            return res.render('login', { msg: 'Invalid email or password.' });
        }
    } catch (err) {
        console.error('Database error:', err);
        return res.render('login', { msg: 'An error occurred. Please try again.' });
    }
});

module.exports = router;
