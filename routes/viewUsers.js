const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Ensure correct path to database config

// Route to view all users
router.get('/', (req, res) => {
    const viewUsersQuery = 'SELECT * FROM login_register';

    db.query(viewUsersQuery, (err, rows) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ message: 'Error fetching users' });
        }

        if (rows.length === 0) {
            return res.render('viewUsers', { msg: 'No users found.' });
        }

        // Render the page with the fetched users
        res.render('viewUsers', { users: rows });
    });
});

module.exports = router;
