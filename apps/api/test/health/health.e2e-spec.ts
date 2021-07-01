import { HealthModule } from '@api/modules/health/health.module';
import { expectResponseCode } from '@api-test-helpers/expect-response-code';
import { withNestAppE2eContext } from '@api-test-helpers/with-nest-app-e2e-context';

import { createRequestAgent } from '../helpers/createRequestAgent';

const appContext = withNestAppE2eContext({
  imports: [HealthModule],
});
describe('HealthModule (e2e)', () => {
  it('/healthz (GET)', async () => {
    const app = appContext.app;
    const { body } = await createRequestAgent(app.getHttpServer())
      .get('/healthz')
      .expect(expectResponseCode({ expectedStatusCode: 200 }));
    expect(body).toStrictEqual({
      details: {
        database: {
          status: 'up',
        },
        redis: {
          status: 'up',
        },
      },
      error: {},
      info: {
        database: {
          status: 'up',
        },
        redis: {
          status: 'up',
        },
      },
      status: 'ok',
    });
  });
});
