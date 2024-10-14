const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// Initialize an in-memory SQLite database with a sample users table
db.serialize(() => {
  db.run('CREATE TABLE users (id INT, username TEXT, status TEXT)');
  db.run("INSERT INTO users (id, username, status) VALUES (1, 'admin', 'active')");
  db.run("INSERT INTO users (id, username, status) VALUES (2, 'user1', 'inactive')");
});

// Vulnerable and Non-Vulnerable Queries
function mostafa(username, userId, userRole) {
  return new Promise((resolve, reject) => {
    const safeUserId = parseInt(userId, 10); // Cast userId to integer
    
    // Query 1: Vulnerable to SQL Injection (user input)
    const vulnerableQuery = `SELECT * FROM users WHERE username = '${username}'`; // SQL Injection vulnerability here!
    db.all(vulnerableQuery, (err, rows) => {
      if (err) {
        console.error('Error executing vulnerable query:', err);
      } else {
        console.log('Vulnerable query result:', rows);
      }
    });

    // Query 2: Non-Vulnerable, using a casted integer (safe)
    const integerQuery = `SELECT * FROM users WHERE id = ${safeUserId}`; // Safe integer input query
    db.all(integerQuery, (err, rows) => {
      if (err) {
        console.error('Error executing integer query:', err);
      } else {
        console.log('Integer query result:', rows);
      }
    });

    // Query 3: Non-Vulnerable, using a constant (safe)
    const constantStatus = 'active'; // Safe constant value
    const constantQuery = `SELECT * FROM users WHERE status = '${constantStatus}'`; // Safe query with constant
    db.all(constantQuery, (err, rows) => {
      if (err) {
        console.error('Error executing constant query:', err);
      } else {
        console.log('Constant query result:', rows);
      }
    });

    // Query 4: Non-Vulnerable, using a value not derived from request data (safe)
    const messageQuery = `SELECT * FROM users WHERE username = 'admin'`; // Safe query not involving user input
    db.all(messageQuery, (err, rows) => {
      if (err) {
        console.error('Error executing message query:', err);
      } else {
        console.log('Message query result:', rows);
      }
    });

    resolve();
  });
}

module.exports = { runSQLQueries };
