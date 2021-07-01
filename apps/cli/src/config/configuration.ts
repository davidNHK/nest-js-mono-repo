import convict from 'convict';

const configSchema = convict({
  env: {
    default: 'development',
    env: 'NODE_ENV',
    format: ['test', 'development', 'production'],
  },
  oidp: {
    clientId: {
      default: null,
      env: 'OIDP_CLIENT_ID',
      format: String,
    },
    clientSecret: {
      default: null,
      env: 'OIDP_CLIENT_SECRET',
      format: String,
    },
    domain: {
      default: null,
      env: 'OIDP_DOMAIN',
      format: String,
    },
  },
});

export function configuration() {
  configSchema.load({});
  configSchema.validate({
    allowed: 'strict',
  });
  return configSchema;
}
