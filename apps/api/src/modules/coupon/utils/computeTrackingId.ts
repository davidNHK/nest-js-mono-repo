import { createHmac } from 'crypto';

export function computeTrackingId({
  coupon,
  customer,
  order,
  secretKey,
}: {
  coupon: { code: string };
  customer: { id: string };
  order: { id: string };
  secretKey: string;
}) {
  return createHmac('SHA256', secretKey)
    .update(`${customer.id}/${order.id}/${coupon.code}`)
    .digest('hex');
}
