import { HealthModule } from '@api/modules/health/health.module';

import { createRequestAgent } from '../helpers/createRequestAgent';
import { expectResponseCode } from '../helpers/expectResponseCode';
import { withNestAppE2EContext } from '../helpers/withNestAppE2EContext';

const appContext = withNestAppE2EContext({
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
