import { ErrorCode } from '@api/exceptions/ErrorCode';
import { CouponModule } from '@api/modules/coupon/coupon.module';
import { DiscountType } from '@api/modules/coupon/entities/coupon.entity';
import { expectResponseCode } from '@api-test-helpers/expect-response-code';
import { withNestAppE2eContext } from '@api-test-helpers/with-nest-app-e2e-context';

import { createRequestAgent } from '../helpers/createRequestAgent';
import {
  applicationBuilder,
  createApplicationInDB,
} from '../helpers/seeders/applications';
import { couponBuilder } from '../helpers/seeders/coupons';

const appContext = withNestAppE2eContext({
  imports: [CouponModule],
});
describe('POST /v1/coupons', () => {
  it('/coupons (POST) will 400 if endDate before startDate', async () => {
    const app = appContext.app;
    const [{ name, server_secret_key: serverSecretKey }] =
      await createApplicationInDB(appContext.module, [
        applicationBuilder({ name: 'test-coupon-400-001' }),
      ]);
    const { body } = await createRequestAgent(app.getHttpServer())
      .post('/v1/coupons')
      .send(
        couponBuilder({
          endDate: new Date('2021-05-01T00:00:00Z'),
          startDate: new Date('2021-06-01T00:00:00Z'),
        }),
      )
      .set('X-App', name)
      .set('X-App-Token', serverSecretKey[0])
      .expect(expectResponseCode({ expectedStatusCode: 400 }));
    expect(body.code).toStrictEqual(ErrorCode.ValidationError);
  });

  it('/coupons (POST) will 400 if missing input', async () => {
    const app = appContext.app;
    const [{ name, server_secret_key: serverSecretKey }] =
      await createApplicationInDB(appContext.module, [
        applicationBuilder({ name: 'test-coupon-400-002' }),
      ]);
    const { body } = await createRequestAgent(app.getHttpServer())
      .post('/v1/coupons')
      .send({})
      .set('X-App', name)
      .set('X-App-Token', serverSecretKey[0])
      .expect(expectResponseCode({ expectedStatusCode: 400 }));
    expect(body.code).toStrictEqual(ErrorCode.ValidationError);
  });
  it('/coupons (POST)', async () => {
    const app = appContext.app;
    const [{ name, server_secret_key: serverSecretKey }] =
      await createApplicationInDB(appContext.module, [
        applicationBuilder({ name: 'create-coupon' }),
      ]);
    const couponPayload = couponBuilder({
      active: true,
      amountOff: 10,
      code: 'code',
      discountType: DiscountType.Amount,
    });
    const { body } = await createRequestAgent(app.getHttpServer())
      .post('/v1/coupons')
      .send(couponPayload)
      .set('X-App', name)
      .set('X-App-Token', serverSecretKey[0])
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
      percentOff: null,
      product: couponPayload.product,
      startDate: couponPayload.startDate.toISOString(),
    });
  });
});
