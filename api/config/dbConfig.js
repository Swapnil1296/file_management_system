const promise = require("bluebird");
const config = require("./config");
const pg = require("pg");

// Promisify the pg module
promise.promisifyAll(pg);

// Create a PostgreSQL client instance
const client = new pg.Client({
  user: config.db.user,
  host: config.db.host,
  database: config.db.database,
  password: config.db.password,
  port: 5432,
});

// Connect to the PostgreSQL database
client
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL");
    // Perform database operations here
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL:", err);
  });
module.exports = client;
