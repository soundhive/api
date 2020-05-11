const parse = require('pg-connection-string').parse;

const config = parse(process.env.DATABASE_URL || "postgres://:@localhost:5432/");

module.exports = {
  "type": "postgres",
  "host": config.host || "localhost",
  "port": config.port || 5432,
  "username": config.user || "",
  "password": config.password || "",
  "database": config.database || "soundhive",
  "synchronize": false,
  "dropSchema": false,
  "logging": true,
  "entities": ['dist/**/*.entity.js'],
  "migrations": ['dist/migration/**/*.js'],
  "subscribers": ["subscriber/**/*.ts", "dist/subscriber/**/.js"],
  "cli": {
    "entitiesDir": "src",
    "migrationsDir": "migration",
    "subscribersDir": "subscriber"
  }
}
