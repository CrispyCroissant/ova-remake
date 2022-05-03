import { Request, Response } from 'express';
import { calculateFare } from '../services/fareService';
import { Fare, Customer } from '../../../shared/types';
import { ErrorCodes } from '../../../shared/enums';
import { BackendError } from '../../../shared/BackendError';
import {
  createOrder,
  deleteOrder as removeOrder,
} from '../services/orderService';

async function saveOrder(req: Request, res: Response): Promise<Response> {
  let fare: Fare = req.body.fare;
  const customer: Customer = req.body.customer;

  if (!fare) {
    return res.status(400).send({
      error: {
        code: ErrorCodes.ROUTE_MISSING_PARAMS,
        message: 'The fare was not provided.',
      },
    });
  }

  if (!customer) {
    return res.status(400).send({
      error: {
        code: ErrorCodes.ROUTE_MISSING_PARAMS,
        message: 'The customer was not provided.',
      },
    });
  }

  req.log.info(null, 'Verifying transport costs...');

  try {
    const verificationFare = await calculateFare(fare.from, fare.to);
    fare = {
      ...verificationFare,
      date: fare.date,
    };
  } catch (err: unknown) {
    const error = err as BackendError;

    req.log.error(error, 'Failed to verify transport costs');

    return res
      .status(error.HTTPStatus)
      .send({ error: { code: error.errorCode, message: error.message } });
  }

  req.log.info(null, 'Saving order...');

  try {
    const order = await createOrder(fare, customer);

    req.log.info(null, 'Order created!');

    return res.send({ order });
  } catch (err: unknown) {
    const error = err as BackendError;

    req.log.error(error, 'Failed to save order');

    return res
      .status(error.HTTPStatus)
      .send({ error: { code: error.errorCode, message: error.message } });
  }
}

async function deleteOrder(req: Request, res: Response): Promise<Response> {
  const orderId: number = req.body.orderId;

  if (!orderId) {
    return res.status(400).send({
      error: {
        code: ErrorCodes.ROUTE_MISSING_PARAMS,
        message: 'No orderID was provided',
      },
    });
  }

  req.log.info(null, 'Removing order...');

  try {
    await removeOrder(orderId);
  } catch (err: unknown) {
    const error = err as BackendError;

    req.log.error(error, 'Failed to remove order');

    return res
      .status(error.HTTPStatus)
      .send({ error: { code: error.errorCode, message: error.message } });
  }

  req.log.info(null, 'Order removed!');

  return res.send();
}

export default { saveOrder, deleteOrder };
