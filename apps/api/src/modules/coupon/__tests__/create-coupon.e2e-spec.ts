import { ErrorCode } from '@api/exceptions/ErrorCode';
import { createRequestAgent } from '@api-test-helpers/createRequestAgent';
import { expectResponseCode } from '@api-test-helpers/expect-response-code';
import { withNestServerContext } from '@api-test-helpers/nest-app-context';
import { couponBuilder } from '@api-test-helpers/seeders/coupons';
import { signFakedToken } from '@api-test-helpers/sign-faked-token';

import { DiscountType } from '../constants/discount-type.constants';
import { CouponModule } from '../coupon.module';

const appContext = withNestServerContext({
  imports: [CouponModule],
});
describe('POST /admin/v1/coupons', () => {
  it('400 if endDate before startDate', async () => {
    const app = appContext.app;
    const { body } = await createRequestAgent(app.getHttpServer())
      .post('/admin/v1/coupons')
      .set('Authorization', signFakedToken(appContext.module))
      .send(
        couponBuilder({
          endDate: new Date('2021-05-01T00:00:00Z'),
          startDate: new Date('2021-06-01T00:00:00Z'),
        }),
      )
      .expect(expectResponseCode({ expectedStatusCode: 400 }));
    expect(body.code).toStrictEqual(ErrorCode.ValidationError);
  });

  it('400 if missing input', async () => {
    const app = appContext.app;
    const { body } = await createRequestAgent(app.getHttpServer())
      .post('/admin/v1/coupons')
      .set('Authorization', signFakedToken(appContext.module))
      .send({})
      .expect(expectResponseCode({ expectedStatusCode: 400 }));
    expect(body.code).toStrictEqual(ErrorCode.ValidationError);
  });
  it('201 with coupon entry created', async () => {
    const app = appContext.app;
    const couponPayload = couponBuilder({
      active: true,
      amountOff: 10,
      code: 'code',
      discountType: DiscountType.Amount,
      endDate: new Date(),
    });
    const { body } = await createRequestAgent(app.getHttpServer())
      .post('/admin/v1/coupons')
      .set('Authorization', signFakedToken(appContext.module))
      .send(couponPayload)
      .expect(expectResponseCode({ expectedStatusCode: 201 }));
    expect(body.data).toStrictEqual({
      active: true,
      amountOff: 10,
      code: couponPayload.code,
      description: null,
      discountType: couponPayload.discountType,
      endDate: couponPayload.endDate.toISOString(),
      id: expect.any(String),
      metadata: {},
      product: couponPayload.product,
      startDate: couponPayload.startDate.toISOString(),
    });
  });
});
