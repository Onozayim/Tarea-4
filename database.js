var sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  }
  console.log("Connected to the SQLite database.");

  db.run(
    `CREATE TABLE task (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task text NOT NULL, 
        done integer DEFAULT 0 NOT NULL
    )`,
    (err) => {}
  );
});

module.exports = db;
