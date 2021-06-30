import { Issuer } from 'openid-client';
import { serializeError } from 'serialize-error';

import { configuration } from './config/configuration';
import { loadEnv } from './config/env-file';

loadEnv();
const config = configuration();

export async function handler() {
  const issuer = await Issuer.discover(
    `${config.get('oidp.domain')}/.well-known/openid-configuration`,
  );
  const client = new issuer.Client({
    client_id: config.get('oidp.clientId'),
    client_secret: config.get('oidp.clientSecret'),
  });
  const token = await client.grant({
    audience: 'https://promotion.neatcommerce.com',
    grant_type: 'client_credentials',
  });
  console.log(token.access_token);
}

handler().catch(e => {
  console.error(serializeError(e));
});
