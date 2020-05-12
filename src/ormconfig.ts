const parse = require('pg-connection-string').parse;

const config = parse(process.env.DATABASE_URL || "postgres://:@localhost:5432/");

import {ConnectionOptions} from 'typeorm';

const ormConfig: ConnectionOptions = {
  type: "postgres",
  host: config.host || "localhost",
  port: config.port || 5432,
  username: config.user || "",
  password: config.password || "",
  database: config.database || "soundhive",
  synchronize: false,
  dropSchema: false,
  migrationsRun: true,
  logging: true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  // allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
}

export = ormConfig;
