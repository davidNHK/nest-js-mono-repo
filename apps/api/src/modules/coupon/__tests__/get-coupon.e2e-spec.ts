import { createRequestAgent } from '@api-test-helpers/createRequestAgent';
import { expectResponseCode } from '@api-test-helpers/expect-response-code';
import { withNestServerContext } from '@api-test-helpers/nest-app-context';
import {
  couponBuilder,
  createCouponInDB,
} from '@api-test-helpers/seeders/coupons';
import { signFakedToken } from '@api-test-helpers/sign-faked-token';

import { DiscountType } from '../constants/discount-type.constants';
import { CouponModule } from '../coupon.module';

const appContext = withNestServerContext({
  imports: [CouponModule],
});
describe('GET /v1/coupons', () => {
  it('/v1/coupons (GET)', async () => {
    const app = appContext.app;
    await createCouponInDB(appContext.module, [
      couponBuilder({
        active: true,
        code: 'dummy-code-001',
        discountType: DiscountType.Amount,
      }),
    ]);
    const { body } = await createRequestAgent(app.getHttpServer())
      .get('/admin/v1/coupons')
      .set('Authorization', signFakedToken(appContext.module))
      .query({
        products: ['template'],
      })
      .expect(expectResponseCode({ expectedStatusCode: 200 }));
    expect(body.data.items).toHaveLength(1);
    expect(body.meta).toStrictEqual({
      limit: 20,
      skip: 0,
      total: 1,
    });
  });
});
