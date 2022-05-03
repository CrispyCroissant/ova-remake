import Stripe from 'stripe';
import stripe from '../config/stripeInstance';
import { BackendError } from '../../../shared/BackendError';
import { ErrorCodes } from '../../../shared/enums';
import { OrderStatus } from '../types/orderStatuses';
import { findOrder, updateOrderStatus } from './orderService';
import prisma from '../config/prismaInstance';
import logger from '../config/logger';

async function createPaymentIntent(orderId: number): Promise<string> {
  const order = await findOrder(orderId);
  const customer = await prisma.customer.findFirst({
    where: { id: order.customerId },
  });
  const price = order.price * 100;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: 'sek',
      receipt_email: customer?.email,
      description: `Transport från ${order.locFrom} till ${order.locTo}`,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId,
      },
    });

    await updateOrderStatus(orderId, OrderStatus.PROCESSING);

    return paymentIntent.client_secret as string;
  } catch (err: unknown) {
    throw new BackendError(
      500,
      ErrorCodes.STRIPE_ERROR,
      'Stripe failed when creating a payment intent.'
    );
  }
}

async function handleEvent(event: Stripe.Event): Promise<void> {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const orderId: number = paymentIntent.metadata.orderId as unknown as number;

  switch (event.type) {
    case 'payment_intent.payment_failed':
    case 'payment_intent.canceled':
      updateOrderStatus(orderId, OrderStatus.CANCELED);
      logger.info(null, `Order ${orderId} - Canceled`);
      break;
    case 'payment_intent.processing':
      updateOrderStatus(orderId, OrderStatus.PROCESSING);
      logger.info(null, `Order ${orderId} - Processing`);
      break;
    case 'payment_intent.succeeded':
      updateOrderStatus(orderId, OrderStatus.PAID);
      logger.info(null, `Order ${orderId} - Paid`);
      break;
    default:
      break;
  }
}

export { createPaymentIntent, handleEvent, stripe };
