import { createRequestAgent } from '@api-test-helpers/create-request-agent';
import { expectResponseCode } from '@api-test-helpers/expect-response-code';
import { withNestServerContext } from '@api-test-helpers/nest-app-context';
import {
  applicationBuilder,
  createApplicationInDB,
} from '@api-test-helpers/seeders/applications';
import { signFakedToken } from '@api-test-helpers/sign-faked-token';
import { describe, expect, it } from '@jest/globals';
import { v4 } from 'uuid';

import { ApplicationModule } from '../application.module';

const appContext = withNestServerContext({
  imports: [ApplicationModule],
});
describe('GET /admin/v1/applications/:id', () => {
  it('404 if id not found', async () => {
    const app = appContext.app;

    await createRequestAgent(app.getHttpServer())
      .get(`/admin/v1/applications/${v4()}`)
      .set('Authorization', signFakedToken(appContext.module))
      .expect(expectResponseCode({ expectedStatusCode: 404 }));
  });

  it('Get application', async () => {
    const app = appContext.app;
    const [createdApplication] = await createApplicationInDB(
      appContext.module,
      [applicationBuilder({ name: 'GET /v1/applications/:id' })],
    );

    const { body } = await createRequestAgent(app.getHttpServer())
      .get(`/admin/v1/applications/${createdApplication.id}`)
      .set('Authorization', signFakedToken(appContext.module))
      .expect(expectResponseCode({ expectedStatusCode: 200 }));
    expect(body.data).toStrictEqual({
      clientSecretKey: [expect.any(String)],
      id: expect.any(String),
      name: 'GET /v1/applications/:id',
      origins: null,
      serverSecretKey: [expect.any(String)],
    });
  });
});
