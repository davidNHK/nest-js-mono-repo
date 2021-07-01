import { CouponModule } from '@api/modules/coupon/coupon.module';
import { DiscountType } from '@api/modules/coupon/entities/coupon.entity';
import { expectResponseCode } from '@api-test-helpers/expect-response-code';
import {
  applicationBuilder,
  createApplicationInDB,
} from '@api-test-helpers/seeders/applications';
import { withNestAppE2eContext } from '@api-test-helpers/with-nest-app-e2e-context';

import { createRequestAgent } from '../helpers/createRequestAgent';
import { couponBuilder, createCouponInDB } from '../helpers/seeders/coupons';

const appContext = withNestAppE2eContext({
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
