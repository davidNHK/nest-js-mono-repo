import dotenv from 'dotenv';
import NodeEnvironment from 'jest-environment-node';
import path from 'path';
import { createConnection } from 'typeorm';

dotenv.config({ path: '.env.test' });

function generateTestId(testPath) {
  const { name, dir } = path.parse(path.relative(process.cwd(), testPath));

  const suffix = path
    .join(dir, name.replace(/\.(e2e-spec|spec)$/, ''))
    .replace(/[/\\. "$]+/g, '-');

  const maxLength = 40;
  if (suffix.length >= maxLength) {
    return suffix.slice(-maxLength).replace(/^./, '-').toLowerCase();
  }
  return suffix.toLowerCase();
}

async function setupDB(testId) {
  const conn = await createConnection({
    logging: true,
    type: 'postgres',
    url: process.env.DATABASE_CONNECTION_URL,
  });
  const schema = `e2e-${testId}`;
  await conn.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
  await conn.close();
  return schema;
}

class E2ETestEnvironment extends NodeEnvironment {
  private readonly testPath: string;

  constructor(config, context) {
    super(config);
    this.testPath = context.testPath;
  }

  async setup() {
    await super.setup();
    const testId = generateTestId(this.testPath);
    this.global.e2eConfig = {
      db: {
        schema: await setupDB(testId),
      },
      testId,
    };
  }

  async teardown() {
    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }
}

module.exports = E2ETestEnvironment;
