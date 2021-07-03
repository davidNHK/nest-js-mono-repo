import { createRequestAgent } from '@api-test-helpers/createRequestAgent';
import { expectResponseCode } from '@api-test-helpers/expect-response-code';
import { getTestName } from '@api-test-helpers/jest/get-test-name';
import { withNestServerContext } from '@api-test-helpers/nest-app-context';
import {
  applicationBuilder,
  createApplicationInDB,
} from '@api-test-helpers/seeders/applications';

import { RedemptionModule } from '../redemption.module';

const appContext = withNestServerContext({
  imports: [RedemptionModule],
});
describe('POST /v1/coupons/:code/redemption', () => {
  it('200 will redemption record created', async () => {
    const app = appContext.app;
    const [{ name, server_secret_key: serverSecretKey }] =
      await createApplicationInDB(appContext.module, [
        applicationBuilder({ name: getTestName() }),
      ]);
    const { body } = await createRequestAgent(app.getHttpServer())
      .post('/v1/coupons/:code/redemption')
      .send({
        endDate: new Date('2021-05-01T00:00:00Z'),
        startDate: new Date('2021-06-01T00:00:00Z'),
      })
      .set('X-App', name)
      .set('X-App-Token', serverSecretKey[0])
      .expect(expectResponseCode({ expectedStatusCode: 201 }));
    expect(body).toStrictEqual({});
  });
});
