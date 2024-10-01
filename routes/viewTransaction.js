const express = require('express');
const router = express.Router();
const pool = require('../config/database'); // Import the pool

// Route to view all transactions
router.get('/', async (req, res) => {
    const viewTransactionsQuery = 'SELECT * FROM transactions'; // Ensure this is your actual table name

    try {
        const [rows] = await pool.query(viewTransactionsQuery); // Use await and destructuring to get the rows
        
        if (rows.length === 0) {
            return res.render('viewTransaction', { msg: 'No transactions found.' });
        }

        // Render the page with the fetched transactions
        res.render('viewTransaction', { transactions: rows });
    } catch (err) {
        console.error('Error fetching transactions:', err);
        return res.status(500).json({ message: 'Error fetching transactions' });
    }
});

module.exports = router;

