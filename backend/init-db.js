const Database = require('better-sqlite3');
const db = new Database('./database/users.db');

// Tabloyu oluştur
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`).run();

console.log('✅ User table created.');