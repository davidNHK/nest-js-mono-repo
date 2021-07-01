import { ApplicationModule } from '@api/modules/application/application.module';
import { signFakedToken } from '@api-test-helpers/sign-faked-token';
import { v4 } from 'uuid';

import { createRequestAgent } from '../helpers/createRequestAgent';
import { expectResponseCode } from '../helpers/expectResponseCode';
import { withNestAppE2EContext } from '../helpers/withNestAppE2EContext';

const appContext = withNestAppE2EContext({
  imports: [ApplicationModule],
});
describe('POST /v1/applications', () => {
  it('Create application', async () => {
    const app = appContext.app;

    const { body } = await createRequestAgent(app.getHttpServer())
      .post('/v1/applications')
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
