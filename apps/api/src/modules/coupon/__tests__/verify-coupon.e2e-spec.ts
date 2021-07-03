import { computeTrackingId } from '@api/modules/coupon/utils/computeTrackingId';
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
import { ConfigService } from '@nestjs/config';

import { DiscountType } from '../constants/discount-type.constants';
import { CouponModule } from '../coupon.module';

const appContext = withNestServerContext({
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
      const config = app.get(ConfigService);
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
          trackingId: computeTrackingId({
            coupon: {
              code: couponCode,
            },
            customer: {
              id: 'fake-id',
            },
            order: {
              id: 'order-id',
            },
            secretKey: config.get('secret.trackingID')[0],
          }),
        })
        .set('X-App', application.name)
        .set('X-App-Token', application.server_secret_key[0])
        .expect(expectResponseCode({ expectedStatusCode: 200 }));
      expect(body.data).toStrictEqual({
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

  it('Can verify from client verify response', async () => {
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
      .post(`/client/v1/coupons/FooBar!/validate`)
      .send({
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
      .set('X-Client-application', application.name)
      .set('X-Client-token', application.client_secret_key[0])
      .expect(expectResponseCode({ expectedStatusCode: 200 }));
    await createRequestAgent(app.getHttpServer())
      .post(`/v1/coupons/FooBar!/validate`)
      .send({
        application: application.name,
        customer: {
          id: 'fake-id',
        },
        order: {
          amount: 650,
          id: 'fake-order-id',
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
      .expect(expectResponseCode({ expectedStatusCode: 200 }));
  });

  it.each(['WWW', 'XYZ'])('report %s invalid', async code => {
    const app = appContext.app;
    const config = app.get(ConfigService);

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
        trackingId: computeTrackingId({
          coupon: {
            code: code,
          },
          customer: {
            id: 'fake-id',
          },
          order: {
            id: 'order-id',
          },
          secretKey: config.get('secret.trackingID')[0],
        }),
      })
      .set('X-App', application.name)
      .set('X-App-Token', application.server_secret_key[0])
      .expect(expectResponseCode({ expectedStatusCode: 400 }));
    expect(body.code).toStrictEqual('ERR_UNKNOWN_COUPON_CODE');
  });
});
