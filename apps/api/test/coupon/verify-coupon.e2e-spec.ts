import { CouponModule } from '@api/modules/coupon/coupon.module';
import { DiscountType } from '@api/modules/coupon/entities/coupon.entity';
import { createRequestAgent } from '@api-test-helpers/createRequestAgent';
import { expectResponseCode } from '@api-test-helpers/expect-response-code';
import {
  applicationBuilder,
  createApplicationInDB,
} from '@api-test-helpers/seeders/applications';
import {
  couponBuilder,
  createCouponInDB,
} from '@api-test-helpers/seeders/coupons';
import { withNestAppE2eContext } from '@api-test-helpers/with-nest-app-e2e-context';

const appContext = withNestAppE2eContext({
  imports: [CouponModule],
});
describe('POST /v1/coupons/:code/validate', () => {
  let application;
  beforeAll(async () => {
    const [applicationInDB] = await createApplicationInDB(appContext.module, [
      applicationBuilder({
        name: 'sign-up',
      }),
    ]);
    application = applicationInDB;
  });
  it.each`
    couponCode   | percent | amount   | deductedAmount
    ${'NCORP25'} | ${25}   | ${65000} | ${48800}
    ${'NCORP50'} | ${50}   | ${65000} | ${32500}
  `(
    '$couponCode coupon should valid and deduct amount from $deductedAmount to $amount',
    async ({ couponCode, percent, amount, deductedAmount }) => {
      const { app } = appContext;
      await createCouponInDB(appContext.module, [
        couponBuilder({
          active: true,
          code: couponCode,
          discountType: DiscountType.Percent,
          percentOff: percent,
          product: 'incorporation',
        }),
      ]);

      const { body } = await createRequestAgent(app.getHttpServer())
        .post(`/v1/coupons/${couponCode}/validate`)
        .send({
          application: application.name,
          customer: {
            id: 'fake-id',
          },
          order: {
            amount: amount,
            id: 'order-id',
            items: [
              {
                price: amount,
                productId: 'incorporation',
                quantity: 1,
              },
            ],
          },
        })
        .set('X-App', application.name)
        .set('X-App-Token', application.server_secret_key[0])
        .expect(expectResponseCode({ expectedStatusCode: 200 }));
      expect(body.data).toStrictEqual({
        amountOff: null,
        code: couponCode,
        discountType: 'PERCENT',
        metadata: {},
        order: {
          amount: amount,
          id: 'order-id',
          items: [
            {
              price: amount,
              productId: 'incorporation',
              quantity: 1,
            },
          ],
          totalAmount: deductedAmount,
          totalDiscountAmount: amount - deductedAmount,
        },
        percentOff: percent,
        trackingId: expect.any(String),
        valid: true,
      });
    },
  );

  it('Will check trackingId in payload if given', async () => {
    const app = appContext.app;
    await createCouponInDB(appContext.module, [
      couponBuilder({
        active: true,
        code: 'FooBar!',
        discountType: DiscountType.Percent,
        percentOff: 25,
        product: 'incorporation',
      }),
    ]);
    const { body } = await createRequestAgent(app.getHttpServer())
      .post(`/v1/coupons/FooBar!/validate`)
      .send({
        application: application.name,
        customer: {
          id: 'fake-id',
        },
        order: {
          amount: 65000,
          id: 'order-id',
          items: [
            {
              price: 65000,
              productId: 'incorporation',
              quantity: 1,
            },
          ],
        },
      })
      .set('X-App', application.name)
      .set('X-App-Token', application.server_secret_key[0])
      .expect(expectResponseCode({ expectedStatusCode: 200 }));
    const { body: checkResult } = await createRequestAgent(app.getHttpServer())
      .post(`/v1/coupons/FooBar!/validate`)
      .send({
        application: application.name,
        customer: {
          id: 'fake-id',
        },
        order: {
          amount: 650,
          id: 'order-id',
          items: [
            {
              price: 65000,
              productId: 'incorporation',
              quantity: 1,
            },
          ],
        },
        trackingId: body.data.trackingId,
      })
      .set('X-App', application.name)
      .set('X-App-Token', application.server_secret_key[0])
      .expect(expectResponseCode({ expectedStatusCode: 400 }));
    expect(checkResult.errors).toStrictEqual(['TrackingId mismatch']);
  });

  it.each(['WWW', 'XYZ'])('report %s invalid', async code => {
    const app = appContext.app;

    const { body } = await createRequestAgent(app.getHttpServer())
      .post(`/v1/coupons/${code}/validate`)
      .send({
        application: application.name,
        customer: {
          id: 'fake-id',
        },
        order: {
          amount: 65000,
          id: 'order-id',
          items: [
            {
              price: 65000,
              productId: 'incorporation',
              quantity: 1,
            },
          ],
        },
      })
      .set('X-App', application.name)
      .set('X-App-Token', application.server_secret_key[0])
      .expect(expectResponseCode({ expectedStatusCode: 400 }));
    expect(body.code).toStrictEqual('ERR_UNKNOWN_COUPON_CODE');
  });
});
