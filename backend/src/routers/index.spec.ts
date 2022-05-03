import request from 'supertest';
import axios from 'axios';

import app from '../app';
import { DistanceMatrixElementStatus } from '../types/distanceMatrix';
import { Customer, Fare } from '../../../shared/types';
import { BackendError } from '../../../shared/BackendError';
import fareMockResult from '../../__test__/fareMockResult';
import * as fareService from '../services/fareService';
import * as orderService from '../services/orderService';
import * as stripeService from '../services/stripeService';

jest.mock('axios');
const mockedAxios = jest.mocked(axios, true);

const mockWebhookEventConstruct = jest.fn();
jest.mock('stripe', () => {
  const webhooks = jest.fn();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  webhooks.constructEvent = (...args) => mockWebhookEventConstruct(...args);
  return jest.fn().mockImplementation(() => ({ webhooks }));
});

describe('POST /api/fare', () => {
  const URL = '/api/fare';
  const testQuery = { from: 'Stockholm', to: 'Uppsala' };

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({
      data: { ...fareMockResult, status: 'OK' },
    });
  });

  it('exists', async () => {
    const res = await request(app).post(URL);
    expect(res.status).toBe(400);
  });

  it("returns an error if no 'from' value was provided", async () => {
    const res = await request(app).post(URL).send({ to: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  it("returns an error if no 'to' value was provided", async () => {
    const res = await request(app).post(URL).send({ from: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  it('returns an error if the queries yielded no results', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        origin_addresses: [''],
        destination_addresses: [''],
        rows: [
          { elements: [{ status: DistanceMatrixElementStatus.NOT_FOUND }] },
        ],
        status: 'OK',
      },
    });

    const res = await request(app).post(URL).send(testQuery);

    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  it('returns a fare on a successful call', async () => {
    const res = await request(app).post(URL).send(testQuery);

    function isFare(object: Record<string, object>): boolean {
      for (const key in object.fare) {
        switch (key) {
          case 'from':
          case 'to':
          case 'distance':
          case 'price':
          case 'tax':
          case 'trips':
            break;
          default:
            return false;
        }
      }
      return true;
    }

    expect(res.status).toBe(200);
    expect(isFare(res.body)).toBe(true);
  });
});

describe('POST /api/order', () => {
  const URL = '/api/order';

  const mockFare: Fare = {
    from: 'A',
    to: 'B',
    distance: 10000,
    price: 5000,
    tax: 1000,
    trips: [],
  };
  const mockCustomer: Customer = {
    firstName: 'John',
    lastName: 'Doe',
    address: 'Washington',
    city: 'None',
    email: 'JohnDoe@email.com',
    phone: '12345',
    regNumber: '54321',
  };
  const params = { fare: mockFare, customer: mockCustomer };

  const mockOrder = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    address: 'Washington',
    city: 'None',
    email: 'JohnDoe@email.com',
    phone: '12345',
    regNumber: '54321',
    from: 'A',
    to: 'B',
    price: 5000,
    tax: 1000,
  };

  beforeEach(() => {
    jest.spyOn(fareService, 'calculateFare').mockResolvedValueOnce(mockFare);
    jest.spyOn(orderService, 'createOrder').mockResolvedValueOnce(mockOrder);
  });

  it('exists', async () => {
    const res = await request(app).post(URL);
    expect(res.status).toBe(400);
  });

  it('returns 400 if a bad/no fare was provided', async () => {
    const res = await request(app).post(URL).send({ customer: {} });
    expect(res.status).toBe(400);
  });

  it('returns 400 if a bad/no customer was provided', async () => {
    const res = await request(app).post(URL).send({ fare: {} });
    expect(res.status).toBe(400);
  });

  it('returns an error if the given fare is invalid', async () => {
    jest.resetAllMocks();
    jest
      .spyOn(fareService, 'calculateFare')
      .mockRejectedValue(new BackendError(406, 1, ''));

    const res = await request(app).post(URL).send(params);
    expect(res.status).toBe(406);
  });

  it("returns an error if order couldn't be saved", async () => {
    jest.resetAllMocks();
    jest
      .spyOn(orderService, 'createOrder')
      .mockRejectedValueOnce(new BackendError(406, 1, ''));

    const res = await request(app).post(URL).send(params);
    expect(res.status).toBe(406);
  });

  it('returns the order on success', async () => {
    const res = await request(app).post(URL).send(params);
    expect(res.status).toBe(200);
    expect(res.body.order).toEqual(mockOrder);
  });
});

describe('DELETE /api/order/', () => {
  const url = '/api/order';

  it('exists', async () => {
    jest.spyOn(orderService, 'deleteOrder').mockResolvedValueOnce();
    const res = await request(app).delete(url).send({ orderId: 12 });
    expect(res.status).toBe(200);
  });

  it('returns an error if no order ID was provided', async () => {
    const res = await request(app).delete(url).send();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  it('returns an error if the order was not found', async () => {
    jest
      .spyOn(orderService, 'deleteOrder')
      .mockRejectedValueOnce(new BackendError(406, 1, ''));

    const res = await request(app).delete(url).send({ orderId: 12 });
    expect(res.status).toBe(406);
    expect(res.body.error).toBeTruthy();
  });
});

describe('POST /api/start-payment', () => {
  const url = '/api/start-payment';

  it('returns an error if no order ID was given', async () => {
    const res = await request(app).post(url).send();
    expect(res.status).toBe(400);
    expect(res.error).toBeTruthy();
  });

  it("returns an error a payment intent wasn't created", async () => {
    jest
      .spyOn(stripeService, 'createPaymentIntent')
      .mockRejectedValueOnce(new BackendError(406, 1, ''));

    const res = await request(app).post(url).send({ orderId: 1 });
    expect(res.status).toBe(406);
    expect(res.error).toBeTruthy();
  });

  it('returns the client secret on success', async () => {
    jest
      .spyOn(stripeService, 'createPaymentIntent')
      .mockResolvedValueOnce('hello');

    const res = await request(app).post(url).send({ orderId: 1 });
    expect(res.body.clientSecret).toBe('hello');
  });
});

describe('POST /api/stripe-webhook', () => {
  const url = '/api/stripe-webhook';
  const mockEvent = {
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

  it('returns an error if no event was given', async () => {
    const res = await request(app).post(url).send();
    expect(res.status).toBe(400);
  });

  it('returns an error if the endpoint security check failed', async () => {
    mockWebhookEventConstruct.mockImplementationOnce(() => {
      throw new Error();
    });

    const res = await request(app)
      .post(url)
      .send({ ...mockEvent });

    expect(res.status).toBe(400);
  });

  it('returns 200 if event was handled without errors', async () => {
    mockWebhookEventConstruct.mockReturnValueOnce(mockEvent);

    const res = await request(app)
      .post(url)
      .send({ ...mockEvent });

    expect(res.status).toBe(200);
  });
});
