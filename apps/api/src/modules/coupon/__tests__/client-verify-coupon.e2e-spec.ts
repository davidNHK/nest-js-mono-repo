import { createRequestAgent } from '@api-test-helpers/create-request-agent';
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
import { customBuilder } from '@api-test-helpers/seeders/customers';
import { orderBuilder } from '@api-test-helpers/seeders/orders';
import { productBuilder } from '@api-test-helpers/seeders/products';

import { DiscountType } from '../constants/discount-type.constants';
import { CouponModule } from '../coupon.module';

const appContext = withNestServerContext({
  imports: [CouponModule],
});
describe('GET /client/v1/coupons/:code/validate', () => {
  it.each`
    couponCode           | discountType                  | coupon                  | exceptedOff             | amount   | deductedAmount
    ${'Percent25'}       | ${DiscountType.Percent}       | ${{ percentOff: 25 }}   | ${{ percentOff: 25 }}   | ${65000} | ${48800}
    ${'Percent50'}       | ${DiscountType.Percent}       | ${{ percentOff: 50 }}   | ${{ percentOff: 50 }}   | ${65000} | ${32500}
    ${'Amount100'}       | ${DiscountType.Amount}        | ${{ amountOff: 10000 }} | ${{ amountOff: 10000 }} | ${65000} | ${55000}
    ${'EffectAmount100'} | ${DiscountType.EffectAmount}  | ${{ amountOff: 10000 }} | ${{ amountOff: 0 }}     | ${65000} | ${65000}
    ${'EffectPercent50'} | ${DiscountType.EffectPercent} | ${{ percentOff: 50 }}   | ${{ amountOff: 0 }}     | ${65000} | ${65000}
  `(
    '$couponCode coupon should valid and deduct amount from $amount to $deductedAmount',
    async ({
      couponCode,
      discountType,
      coupon,
      amount,
      exceptedOff,
      deductedAmount,
    }) => {
      const { app } = appContext;
      const [application] = await createApplicationInDB(appContext.module, [
        applicationBuilder({
          name: getTestName(),
        }),
      ]);
      const product = productBuilder();
      const order = orderBuilder({
        amount: amount,
        items: [product],
      });
      const customer = customBuilder();
      await createCouponInDB(appContext.module, [
        couponBuilder({
          active: true,
          code: couponCode,
          discountType: discountType,
          product: product.productId,
          ...coupon,
        }),
      ]);

      const { body } = await createRequestAgent(app.getHttpServer())
        .post(`/client/v1/coupons/${couponCode}/validate`)
        .send({
          customer: customer,
          order: order,
        })
        .set('x-client-application', application.name)
        .set('x-client-token', application.clientSecretKey[0])
        .expect(expectResponseCode({ expectedStatusCode: 200 }));
      expect(body.data).toStrictEqual({
        code: couponCode,
        discountType,
        metadata: {},
        order: {
          totalAmount: deductedAmount,
          totalDiscountAmount: amount - deductedAmount,
          ...order,
        },
        trackingId: expect.any(String),
        ...exceptedOff,
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
      .post(`/client/v1/coupons/${code}/validate`)
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
      .set('x-client-application', application.name)
      .set('x-client-token', application.clientSecretKey[0])
      .expect(expectResponseCode({ expectedStatusCode: 400 }));
    expect(body.code).toStrictEqual('ERR_UNKNOWN_COUPON_CODE');
  });
});
