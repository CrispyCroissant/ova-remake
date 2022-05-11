import { Request, Response } from 'express';
import Stripe from 'stripe';
import stripe from '../config/stripeInstance';
import { BackendError } from '../../../shared/BackendError';
import { ErrorCodes } from '../../../shared/enums';
import { createPaymentIntent, handleEvent } from '../services/stripeService';

async function createIntent(req: Request, res: Response): Promise<Response> {
  const orderId: number = req.body.orderId;

  if (!orderId) {
    return res.status(400).send({
      error: {
        code: ErrorCodes.ROUTE_MISSING_PARAMS,
        message: 'No order ID was provided.',
      },
    });
  }

  req.log.info(null, 'Creating payment intent...');

  try {
    const clientSecret = await createPaymentIntent(orderId);

    req.log.info(null, 'Created payment intent!');

    return res.send({ clientSecret });
  } catch (err: unknown) {
    const error = err as BackendError;

    req.log.error(error, 'Failed to create payment intent');

    return res.status(error.HTTPStatus).send({
      error: { code: error.errorCode, message: error.message },
    });
  }
}

async function processPayment(req: Request, res: Response): Promise<Response> {
  let event: Stripe.Event = req.body;

  if (!event.id) {
    return res.sendStatus(400);
  }

  // Event verification
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      req.headers['stripe-signature'] as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: unknown) {
    const error = err as Error;
    req.log.error(error, 'Webhook error');
    return res.sendStatus(400);
  }

  await handleEvent(event);

  return res.sendStatus(200);
}

export default { createIntent, processPayment };
