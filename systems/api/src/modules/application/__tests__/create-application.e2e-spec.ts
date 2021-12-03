import { createRequestAgent } from '@api-test-helpers/create-request-agent';
import { expectResponseCode } from '@api-test-helpers/expect-response-code';
import { withNestServerContext } from '@api-test-helpers/nest-app-context';
import { signFakedToken } from '@api-test-helpers/sign-faked-token';
import { describe, expect, it } from '@jest/globals';
import { v4 } from 'uuid';

import { ApplicationModule } from '../application.module';

const appContext = withNestServerContext({
  imports: [ApplicationModule],
});
describe('POST /admin/v1/applications', () => {
  it('Create application', async () => {
    const app = appContext.app;

    const { body } = await createRequestAgent(app.getHttpServer())
      .post('/admin/v1/applications')
      .set('Authorization', signFakedToken(appContext.module))
      .send({
        clientSecretKey: [v4()],
        name: 'fake-app',
        origins: ['http://localhost:3000'],
        serverSecretKey: [v4()],
      })
      .expect(expectResponseCode({ expectedStatusCode: 201 }));
    expect(body.data).toStrictEqual({
      clientSecretKey: [expect.any(String)],
      id: expect.any(String),
      name: 'fake-app',
      origins: ['http://localhost:3000'],
      serverSecretKey: [expect.any(String)],
    });
  });
});
