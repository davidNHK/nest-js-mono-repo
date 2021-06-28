import { CouponModule } from '@api/modules/coupon/coupon.module';
import { DiscountType } from '@api/modules/coupon/entities/coupon.entity';
import {
  applicationBuilder,
  createApplicationInDB,
} from '@api-test-helpers/seeders/applications';

import { createRequestAgent } from '../helpers/createRequestAgent';
import { expectResponseCode } from '../helpers/expectResponseCode';
import { couponBuilder, createCouponInDB } from '../helpers/seeders/coupons';
import { withNestAppE2EContext } from '../helpers/withNestAppE2EContext';

const appContext = withNestAppE2EContext({
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
