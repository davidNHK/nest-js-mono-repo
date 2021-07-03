import { createRequestAgent } from '@api-test-helpers/createRequestAgent';
import { expectResponseCode } from '@api-test-helpers/expect-response-code';
import { getTestName } from '@api-test-helpers/jest/get-test-name';
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
describe('GET /client/v1/coupons/:code/validate', () => {
  it.each`
    couponCode   | percent | amount   | deductedAmount
    ${'NCORP25'} | ${25}   | ${65000} | ${48800}
    ${'NCORP50'} | ${50}   | ${65000} | ${32500}
  `(
    '$couponCode coupon should valid and deduct amount from $deductedAmount to $amount',
    async ({ couponCode, percent, amount, deductedAmount }) => {
      const { app } = appContext;
      const [application] = await createApplicationInDB(appContext.module, [
        applicationBuilder({
          name: getTestName(),
        }),
      ]);
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
        .get(`/client/v1/coupons/${couponCode}/validate`)
        .query({
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
        .send()
        .set('x-client-application', application.name)
        .set('x-client-token', application.client_secret_key[0])
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

  it.each(['WWW', 'XYZ'])('report %s invalid', async code => {
    const app = appContext.app;
    const [application] = await createApplicationInDB(appContext.module, [
      applicationBuilder({
        name: getTestName(),
      }),
    ]);
    const { body } = await createRequestAgent(app.getHttpServer())
      .get(`/client/v1/coupons/${code}/validate`)
      .query({
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
      .send()
      .set('x-client-application', application.name)
      .set('x-client-token', application.client_secret_key[0])
      .expect(expectResponseCode({ expectedStatusCode: 400 }));
    expect(body.code).toStrictEqual('ERR_UNKNOWN_COUPON_CODE');
  });
});
