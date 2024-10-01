// routes/dashboard.js
const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./login_register.db');
function isAuthenticated(req, res, next) {
  if (req.session && req.session.userName) {
    next();
  } else {
    res.redirect('/login'); // Redirect to login if not authenticated
  }
}
router.get('/', isAuthenticated, (req, res) => {
  const userName = req.session.userName; // Get logged-in user's name from the session
  const query = 'SELECT name, balance FROM users WHERE name = ?';
  db.get(query, [userName], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }

    if (row) {
      // Render dashboard with user info
      res.render('dashboard', { users: row });
    } else {
      res.status(404).send('User not found');
    }
  });
});
module.exports = router;
