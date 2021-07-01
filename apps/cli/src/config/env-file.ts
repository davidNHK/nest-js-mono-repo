import env from 'dotenv';
import path from 'path';

export function getEnvFilePath() {
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  if (nodeEnv === 'development') {
    return '.env';
  }

  if (nodeEnv === 'test') {
    return '.env.test';
  }

  return '.env';
}

export function loadEnv() {
  const envPath = path.resolve(process.cwd(), getEnvFilePath());
  env.config({
    path: envPath,
  });
}
