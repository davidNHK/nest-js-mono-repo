module.exports = {
  cli: {
    migrationsDir: 'src/migrations',
  },
  entities: ['dist/modules/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  type: 'postgres',
  url: process.env.DATABASE_CONNECTION_URL,
};
