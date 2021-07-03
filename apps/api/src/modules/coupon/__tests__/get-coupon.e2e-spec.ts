import { createRequestAgent } from '@api-test-helpers/createRequestAgent';
import { expectResponseCode } from '@api-test-helpers/expect-response-code';
import { withNestServerContext } from '@api-test-helpers/nest-app-context';
import {
  applicationBuilder,
  createApplicationInDB,
} from '@api-test-helpers/seeders/applications';
import {
  couponBuilder,
  createCouponInDB,
} from '@api-test-helpers/seeders/coupons';

import { CouponModule } from '../coupon.module';
import { DiscountType } from '../entities/coupon.entity';

const appContext = withNestServerContext({
  imports: [CouponModule],
});
describe('GET /v1/coupons', () => {
  it('/v1/coupons (GET)', async () => {
    const app = appContext.app;
    const [{ name, server_secret_key: serverSecretKey }] =
      await createApplicationInDB(appContext.module, [
        applicationBuilder({ name: '/v1/coupons (GET)' }),
      ]);
    await createCouponInDB(appContext.module, [
      couponBuilder({
        active: true,
        code: 'dummy-code-001',
        discountType: DiscountType.Amount,
      }),
    ]);
    const { body } = await createRequestAgent(app.getHttpServer())
      .get('/v1/coupons')
      .query({
        products: ['template'],
      })
      .set('X-App', name)
      .set('X-App-Token', serverSecretKey[0])
      .expect(expectResponseCode({ expectedStatusCode: 200 }));
    expect(body.data.items).toHaveLength(1);
    expect(body.meta).toStrictEqual({
      limit: 20,
      skip: 0,
      total: 1,
    });
  });
});
