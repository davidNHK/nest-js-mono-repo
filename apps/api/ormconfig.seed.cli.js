const { SnakeNamingStrategy } = require('typeorm-naming-strategies');

require('dotenv').config();

const env = process.env.NODE_ENV;

const config = ['development'].includes(env)
  ? {
      cli: {
        migrationsDir: `src/seeds/${env}`,
      },
      entities: ['src/modules/**/*.entity.ts'],
      migrations: [`src/seeds/${process.env.NODE_ENV}/*.ts`],
      migrationsTableName: 'seeds',
      namingStrategy: new SnakeNamingStrategy(),
      type: 'postgres',
      url: process.env.DATABASE_CONNECTION_URL,
    }
  : {
      cli: {
        migrationsDir: `src/seeds/${env}`,
      },
      entities: ['dist/modules/**/*.entity.js'],
      migrations: [`dist/seeds/${process.env.NODE_ENV}/*.js`],
      migrationsTableName: 'seeds',
      namingStrategy: new SnakeNamingStrategy(),
      type: 'postgres',
      url: process.env.DATABASE_CONNECTION_URL,
    };

module.exports = config;
