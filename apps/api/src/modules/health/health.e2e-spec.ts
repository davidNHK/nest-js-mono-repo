import { createRequestAgent } from '@api-test-helpers/createRequestAgent';
import { expectResponseCode } from '@api-test-helpers/expect-response-code';
import { withNestServerContext } from '@api-test-helpers/nest-app-context';

import { HealthModule } from './health.module';

const appContext = withNestServerContext({
  imports: [HealthModule],
});
describe('GET /healthz', () => {
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
