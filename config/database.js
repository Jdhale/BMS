// config/database.js
const mysql = require('mysql2/promise'); // Use the promise-based version

const pool = mysql.createPool({
    host: 'localhost',
    database: 'Bank_management',
    user: 'root',
    password: 'janhvi123',
    port: '3306',
    connectionLimit: 10
});

// Check database connection
const checkConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully');
        connection.release(); // Release the connection back to the pool
    } catch (err) {
        console.error('Database connection failed:', err);
    }
};

// Call the connection check function
checkConnection();

module.exports = pool; // Export the pool for use in your routes
