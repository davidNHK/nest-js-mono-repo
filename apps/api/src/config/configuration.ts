import convict from 'convict';
import path from 'path';

const configSchema = convict({
  database: {
    connectionURL: {
      default: null,
      env: 'DATABASE_CONNECTION_URL',
      format: String,
    },
    type: {
      default: 'postgres',
      format: String,
    },
  },
  env: {
    default: 'development',
    env: 'NODE_ENV',
    format: ['test', 'development', 'production'],
  },
  oidp: {
    audience: {
      default: null,
      env: 'OIDP_AUDIENCE',
      format: String,
    },
    domain: {
      default: null,
      env: 'OIDP_DOMAIN',
      format: String,
    },
  },
  port: {
    default: null,
    env: 'PORT',
    format: 'port',
  },
  redis: {
    host: {
      default: null,
      env: 'REDIS_HOST',
      format: String,
    },
  },
});

export function configuration() {
  const env = configSchema.get('env');
  const configPath = path.join(__dirname, `configuration.${env}`);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  configSchema.load(require(configPath).config);

  configSchema.validate({
    allowed: 'strict',
  });
  return configSchema.getProperties();
}
