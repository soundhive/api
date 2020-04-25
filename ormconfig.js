const parse = require('pg-connection-string').parse;

const config = parse(process.env.DATABASE_URL || "postgres://:@localhost:5432/");

module.exports = {
  "type": "postgres",
  "host": config.host || "localhost",
  "port": config.port || 5432,
  "username": config.user || "",
  "password": config.password || "",
  "database": config.database || "soundbase",
  "synchronize": true,
  "dropSchema": false,
  "logging": true,
  "entities": ['dist/**/*.entity.js'],
  "migrations": ["migrations/**/*.ts"],
  "subscribers": ["subscriber/**/*.ts", "dist/subscriber/**/.js"],
  "cli": {
    "entitiesDir": "src",
    "migrationsDir": "migrations",
    "subscribersDir": "subscriber"
  }
}
