import { DiscountType } from '@api/modules/coupon/constants/discount-type.constants';
import { TrackingService } from '@api/modules/coupon/services/tracking.service';
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
import { customBuilder } from '@api-test-helpers/seeders/customers';
import { orderBuilder } from '@api-test-helpers/seeders/orders';
import { productBuilder } from '@api-test-helpers/seeders/products';
import type { TestingModule } from '@nestjs/testing';

import { RedemptionModule } from '../redemption.module';
import { RedemptionState } from '../states/redemption-stateus';

function computeTrackingId(
  app: TestingModule,
  {
    coupon,
    customer,
    order,
  }: {
    coupon: {
      code: string;
    };
    customer: {
      id: string;
    };
    order: {
      id: string;
    };
  },
) {
  const trackingService = app.get(TrackingService);
  return trackingService.generateTrackingIds({ coupon, customer, order })[0];
}

const appContext = withNestServerContext({
  imports: [RedemptionModule],
});
describe('POST /v1/coupons/:code/redemption', () => {
  it.each`
    code                 | discountType            | redeemStatus
    ${'AmountDiscount'}  | ${DiscountType.Amount}  | ${RedemptionState.FulFilled}
    ${'PercentDiscount'} | ${DiscountType.Percent} | ${RedemptionState.FulFilled}
  `(
    'created redemption record with $redeemStatus status for $code',
    async ({ code, discountType, redeemStatus }) => {
      const app = appContext.app;
      const [{ name, serverSecretKey }] = await createApplicationInDB(
        appContext.module,
        [applicationBuilder({ name: getTestName() })],
      );
      const [coupon] = await createCouponInDB(appContext.module, [
        couponBuilder({
          active: true,
          code: code,
          discountType: discountType,
        }),
      ]);
      const customer = customBuilder();
      const order = orderBuilder({ amount: 0, items: [productBuilder()] });
      const trackingId = computeTrackingId(appContext.module, {
        coupon: {
          code: coupon.code,
        },
        customer: {
          id: customer.id,
        },
        order: {
          id: order.id,
        },
      });
      const { body } = await createRequestAgent(app.getHttpServer())
        .post(`/v1/coupons/${coupon.code}/redemption`)
        .send({
          customer: customer,
          order: order,
          trackingId: trackingId,
        })
        .set('X-App', name)
        .set('X-App-Token', serverSecretKey[0])
        .expect(expectResponseCode({ expectedStatusCode: 201 }));
      expect(body.data).toStrictEqual({
        createdAt: expect.any(String),
        customerId: customer.id,
        id: expect.any(String),
        metadata: {},
        orderId: order.id,
        status: redeemStatus,
        trackingId: trackingId,
        updatedAt: expect.any(String),
      });
    },
  );
});
