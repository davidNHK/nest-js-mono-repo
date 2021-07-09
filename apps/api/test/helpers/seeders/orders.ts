import type { VerifyingOrderRequest } from '@api/modules/coupon/dto/requests/verify-coupon.dto';
import type { RedemptionOrderRequest } from '@api/modules/redemption/dto/requests/create-redemption.dto';

import { productBuilder } from './products';

export function orderBuilder(
  override?: Partial<VerifyingOrderRequest | RedemptionOrderRequest>,
): any {
  const result = {
    id: 'fake-order-id',
    items: [productBuilder({ price: override.amount })],
    metadata: {},
    ...override,
  };
  return result;
}
