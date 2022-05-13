import { Order } from '@prisma/client';
import { BackendError } from '../../../shared/BackendError';
import { ErrorCodes } from '../../../shared/enums';
import { Customer, Fare } from '../../../shared/types';
import prisma from '../config/prismaInstance';
import { createMessage, createUpdateMsg } from '../helpers/helpers';
import { OrderStatus } from '../types/orderStatuses';
import { sendEmail } from './mailService';

async function createOrder(fare: Fare, customer: Customer): Promise<unknown> {
  const { firstName, lastName, address, city, email, phone } = customer;
  const { from, to, price, tax, date } = fare;

  try {
    const order = await prisma.order.create({
      data: {
        locFrom: from,
        locTo: to,
        date: new Date(date as string),
        price,
        tax,
        status: OrderStatus.STARTED,
        customer: {
          create: {
            firstName,
            lastName,
            address,
            city,
            email,
            phone,
            ...(customer.regNumber && {
              regNumber: customer.regNumber,
            }),
          },
        },
      },
    });

    await sendEmail(
      createMessage(customer, fare, order.id, OrderStatus.STARTED)
    );

    return order;
  } catch (err: unknown) {
    const error = err as BackendError;

    if (error.HTTPStatus) {
      throw error;
    }

    throw new BackendError(
      500,
      ErrorCodes.DB_CANT_SAVE,
      "Couldn't save order to database"
    );
  }
}

async function deleteOrder(orderId: number): Promise<void> {
  try {
    await prisma.order.delete({ where: { id: orderId } });
  } catch (e) {
    throw new BackendError(
      400,
      ErrorCodes.ORDER_NOT_FOUND,
      "Couldn't delete order. Order wasn't found."
    );
  }
}

async function findOrder(orderId: number): Promise<Order> {
  try {
    const order = await prisma.order.findFirst({ where: { id: orderId } });
    return order as Order;
  } catch (err: unknown) {
    throw new BackendError(
      400,
      ErrorCodes.ORDER_NOT_FOUND,
      'The given order ID returned no order.'
    );
  }
}

async function updateOrderStatus(
  orderId: number,
  newStatus: OrderStatus
): Promise<void> {
  try {
    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: newStatus,
      },
    });

    await sendEmail(createUpdateMsg(order.id, newStatus), true);
  } catch (err: unknown) {
    const error = err as BackendError;

    if (error.HTTPStatus) {
      throw error;
    }

    throw new BackendError(
      400,
      ErrorCodes.ORDER_NOT_FOUND,
      'The given order ID returned no order.'
    );
  }
}

export { createOrder, deleteOrder, findOrder, updateOrderStatus };
