const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./pokemon.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

db.serialize(() => {
  // Drop existing table to refresh the database
  db.run(`DROP TABLE IF EXISTS pokemons`, (err) => {
    if (err) {
      console.error('Error dropping table:', err.message);
    } else {
      console.log('Existing pokemon table dropped (if it existed).');
    }
  });

  // Create fresh table
  db.run(
    `CREATE TABLE pokemons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pokemon_id INTEGER,
      story TEXT
    )`,
    (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Fresh pokemon table created.');
      }
    }
  );
});

module.exports = db;
