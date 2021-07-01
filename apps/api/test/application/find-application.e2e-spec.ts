import { ApplicationModule } from '@api/modules/application/application.module';
import {
  applicationBuilder,
  createApplicationInDB,
} from '@api-test-helpers/seeders/applications';
import { signFakedToken } from '@api-test-helpers/sign-faked-token';
import { v4 } from 'uuid';

import { createRequestAgent } from '../helpers/createRequestAgent';
import { expectResponseCode } from '../helpers/expectResponseCode';
import { withNestAppE2EContext } from '../helpers/withNestAppE2EContext';

const appContext = withNestAppE2EContext({
  imports: [ApplicationModule],
});
describe('GET /v1/applications/:id', () => {
  it('404 if id not found', async () => {
    const app = appContext.app;

    await createRequestAgent(app.getHttpServer())
      .get(`/v1/applications/${v4()}`)
      .set('Authorization', signFakedToken(appContext.module))
      .expect(expectResponseCode({ expectedStatusCode: 404 }));
  });

  it('Update application', async () => {
    const app = appContext.app;
    const [createdApplication] = await createApplicationInDB(
      appContext.module,
      [applicationBuilder({ name: 'GET /v1/applications/:id' })],
    );

    const { body } = await createRequestAgent(app.getHttpServer())
      .get(`/v1/applications/${createdApplication.id}`)
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
