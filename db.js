const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// Initialize an in-memory SQLite database with a sample users table
db.serialize(() => {
  db.run('CREATE TABLE users (id INT, username TEXT, status TEXT)');
  db.run("INSERT INTO users (id, username, status) VALUES (1, 'admin', 'active')");
  db.run("INSERT INTO users (id, username, status) VALUES (2, 'user1', 'inactive')");
});

// Vulnerable function that performs an SQL query
function findUser(username, userId, userRole) {
  return new Promise((resolve, reject) => {
    // Non-vulnerable: This line uses a constant integer
    const hardcodedId = 1; // Integer not influenced by user input

    // Non-vulnerable: This line uses a constant due to a condition
    const statusCondition = userRole === 'admin' ? 'active' : 'inactive'; // Not user-controlled

    // Non-vulnerable: This line uses a value that doesn't come from the request data
    const serverMessage = "Welcome, admin"; // Hardcoded message, not affected by request

    // Vulnerable: SQL Injection Vulnerable! User input is used directly in the query
    const query = `SELECT * FROM users WHERE username = '${username}' AND id = ${userId} AND status = '${statusCondition}'`; // Vulnerable line

    db.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = { findUser };
