import Stripe from 'stripe';
import { BackendError } from '../../../shared/BackendError';
import { ErrorCodes } from '../../../shared/enums';
import { OrderStatus } from '../types/orderStatuses';
import * as orderService from './orderService';
import { createPaymentIntent, handleEvent } from './stripeService';

/* Taken from https://stackoverflow.com/a/69287954 */
const mockPaymentIntentCreate = jest.fn();
jest.mock('stripe', () => {
  const paymentIntents = jest.fn();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  paymentIntents.create = (...args) => mockPaymentIntentCreate(...args);
  return jest.fn().mockImplementation(() => ({ paymentIntents }));
});

jest.mock('./orderService');

describe('createPaymentIntent', () => {
  it("returns an error if order wasn't found", async () => {
    jest.spyOn(orderService, 'findOrder').mockRejectedValueOnce(new Error());

    expect.assertions(1);
    try {
      await createPaymentIntent(1);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it("returns an error if Stripe couldn't create a payment intent", async () => {
    jest.spyOn(orderService, 'findOrder').mockResolvedValueOnce({
      id: 1,
      locFrom: 'a',
      locTo: 'b',
      date: new Date(),
      customerId: 2,
      price: 100,
      status: 'f',
      tax: 3,
    });
    mockPaymentIntentCreate.mockRejectedValueOnce(new Error());
    try {
      await createPaymentIntent(1);
    } catch (err: unknown) {
      const error = err as BackendError;
      expect(error.HTTPStatus).toBe(500);
      expect(error.errorCode).toBe(ErrorCodes.STRIPE_ERROR);
      expect(error.message).toBeTruthy();
    }
  });

  it('updates the order status on success', async () => {
    const spy = jest
      .spyOn(orderService, 'updateOrderStatus')
      .mockResolvedValueOnce();
    jest.spyOn(orderService, 'findOrder').mockResolvedValueOnce({
      id: 1,
      locFrom: 'a',
      locTo: 'b',
      date: new Date(),
      customerId: 2,
      price: 100,
      status: 'f',
      tax: 3,
    });
    mockPaymentIntentCreate.mockResolvedValueOnce({ client_secret: 'test' });

    await createPaymentIntent(1);

    expect(spy).toHaveBeenCalledWith(1, OrderStatus.PROCESSING);
  });

  it('returns a payment intent if everything was successful', async () => {
    jest.spyOn(orderService, 'findOrder').mockResolvedValueOnce({
      id: 1,
      locFrom: 'a',
      locTo: 'b',
      date: new Date(),
      customerId: 2,
      price: 100,
      status: 'f',
      tax: 3,
    });
    mockPaymentIntentCreate.mockResolvedValueOnce({ client_secret: 'test' });

    const result = await createPaymentIntent(1);

    expect(result).toBe('test');
  });
});

describe('handleEvent', () => {
  const mockEvent: Stripe.Event = {
    id: '1',
    api_version: '2',
    created: 2,
    data: {
      object: {
        metadata: { orderId: 1 },
      },
    },
    livemode: false,
    pending_webhooks: 0,
    request: {
      id: null,
      idempotency_key: null,
    },
    type: 'payment_intent.canceled',
    object: 'event',
  };
  let spy: jest.SpyInstance;

  beforeEach(() => {
    spy = jest.spyOn(orderService, 'updateOrderStatus').mockResolvedValueOnce();
  });

  it('updates the order status if the payment intent is canceled', async () => {
    await handleEvent(mockEvent);

    expect(spy).toHaveBeenCalledWith(1, OrderStatus.CANCELED);
  });

  it('updates the order status if the payment intent has failed', async () => {
    mockEvent.type = 'payment_intent.payment_failed';

    await handleEvent(mockEvent);

    expect(spy).toHaveBeenCalledWith(1, OrderStatus.CANCELED);
  });

  it('updates the order status if the payment intent is processing', async () => {
    mockEvent.type = 'payment_intent.processing';

    await handleEvent(mockEvent);

    expect(spy).toHaveBeenCalledWith(1, OrderStatus.PROCESSING);
  });

  it('updates the order status if the payment intent succeeded', async () => {
    mockEvent.type = 'payment_intent.succeeded';

    await handleEvent(mockEvent);

    expect(spy).toHaveBeenCalledWith(1, OrderStatus.PAID);
  });
});
