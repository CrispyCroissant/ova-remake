import { Order, PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import {
  createOrder,
  deleteOrder,
  findOrder,
  updateOrderStatus,
} from './orderService';
import { Fare, Customer } from '../../../shared/types';
import prisma from '../config/prismaInstance';
import { BackendError } from '../../../shared/BackendError';
import { ErrorCodes } from '../../../shared/enums';
import { OrderStatus } from '../types/orderStatuses';
import * as mailService from './mailService';

jest.mock('../config/prismaInstance', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

jest.mock('./mailService');

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const mockMailService = jest.mocked(mailService);

describe('createOrder', () => {
  const mockFareParam: Fare = {
    from: 'A',
    to: 'B',
    distance: 10000,
    price: 5432,
    tax: 1234,
    trips: [],
  };
  const mockCustomerParam: Customer = {
    firstName: 'John',
    lastName: 'Doe',
    address: 'Bing',
    city: 'Bong',
    email: 'JohnDoe@email.com',
    phone: '123',
    regNumber: '321',
  };

  const mockDBOrder: Order = {
    id: 1,
    locFrom: 'A',
    locTo: 'B',
    date: new Date(),
    price: 5432,
    tax: 1234,
    status: 'STARTED',
    customerId: 1,
  };

  beforeEach(() => {
    mockReset(prismaMock);
    jest.resetAllMocks();
  });

  it("throws an error if the order couldn't be saved", async () => {
    prismaMock.order.create.mockRejectedValueOnce(new Error());

    expect.assertions(2);
    try {
      await createOrder(mockFareParam, mockCustomerParam);
    } catch (err: unknown) {
      const error = err as BackendError;
      expect(error.HTTPStatus).toBe(500);
      expect(error.errorCode).toBe(ErrorCodes.DB_CANT_SAVE);
    }
  });

  it("throws an error if the email couldn't be sent", async () => {
    mockMailService.sendEmail.mockRejectedValueOnce(null);

    expect.assertions(1);
    try {
      await createOrder(mockFareParam, mockCustomerParam);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('saves the order if valid', async () => {
    prismaMock.order.create.mockResolvedValueOnce(mockDBOrder);

    expect.assertions(0);
    try {
      await createOrder(mockFareParam, mockCustomerParam);
    } catch (error) {
      expect(error).toBeFalsy();
    }
  });

  it('sends an email if order is valid', async () => {
    prismaMock.order.create.mockResolvedValueOnce(mockDBOrder);

    await createOrder(mockFareParam, mockCustomerParam);
    expect(mockMailService.sendEmail).toBeCalled();
  });

  it('returns the order if valid', async () => {
    prismaMock.order.create.mockResolvedValueOnce(mockDBOrder);

    expect.assertions(1);
    try {
      const order = await createOrder(mockFareParam, mockCustomerParam);
      expect(order).toEqual(mockDBOrder);
    } catch (error) {
      return;
    }
  });
});

describe('deleteOrder', () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  it("throws an error if the order wasn't found", async () => {
    prismaMock.order.delete.mockRejectedValueOnce(new Error());

    try {
      await deleteOrder(1);
    } catch (err: unknown) {
      const error = err as BackendError;
      expect(error.HTTPStatus).toBe(400);
      expect(error.errorCode).toBe(ErrorCodes.ORDER_NOT_FOUND);
    }
  });

  it('returns nothing if order was succesfully deleted', async () => {
    prismaMock.order.delete.mockResolvedValueOnce({
      id: 1,
      locFrom: 'a',
      locTo: 'b',
      date: new Date(),
      price: 1,
      tax: 2,
      status: 'nah',
      customerId: 2,
    });

    expect.assertions(1);
    try {
      const result = await deleteOrder(1);
      expect(result).toBe(null);
    } catch (err: unknown) {
      return;
    }
  });
});

describe('findOrder', () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  it("throws an error if order wasn't found", async () => {
    prismaMock.order.findFirst.mockRejectedValueOnce(new Error());

    try {
      await findOrder(1);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('returns the order if the order was found', async () => {
    const mockResult: Order = {
      id: 1,
      locFrom: 'a',
      locTo: 'b',
      date: new Date(),
      price: 1,
      tax: 2,
      status: 'y',
      customerId: 3,
    };
    prismaMock.order.findFirst.mockResolvedValueOnce(mockResult);

    const order = await findOrder(1);

    expect(order).toEqual(mockResult);
  });
});

describe('updateOrderStatus', () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  it("throws an error if order wasn't found", async () => {
    prismaMock.order.update.mockRejectedValueOnce(new Error());

    try {
      await updateOrderStatus(1, OrderStatus.PROCESSING);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('returns nothing on successful update', async () => {
    prismaMock.order.update.mockResolvedValueOnce({
      id: 1,
      locFrom: 'a',
      locTo: 'b',
      date: new Date(),
      price: 1,
      status: OrderStatus.PROCESSING,
      tax: 2,
      customerId: 3,
    });

    expect.assertions(0);
    try {
      await updateOrderStatus(1, OrderStatus.PROCESSING);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});
