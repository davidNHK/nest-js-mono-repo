import type { VerifyingCustomerRequest } from '@api/modules/coupon/dto/requests/verify-coupon.dto';
import type { RedemptionCustomerRequest } from '@api/modules/redemption/dto/requests/create-redemption.dto';

export function customBuilder(
  override?: Partial<VerifyingCustomerRequest | RedemptionCustomerRequest>,
): any {
  const result = {
    id: 'fake-customer-id',
    ...override,
  };
  return result;
}
