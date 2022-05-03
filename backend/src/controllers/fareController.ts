import { Request, Response } from 'express';
import { calculateFare } from '../services/fareService';
import { Fare } from '../../../shared/types';
import { ErrorCodes } from '../../../shared/enums';
import { BackendError } from '../../../shared/BackendError';

async function getFare(req: Request, res: Response): Promise<Response> {
  const { from, to }: { from: string; to: string } = req.body;

  if (!from || !to) {
    return res.status(400).send({
      error: {
        code: ErrorCodes.ROUTE_MISSING_PARAMS,
        message: "No 'from' and/or 'to' values were provided.",
      },
    });
  }

  req.log.info(null, `Calculating fare ('${from}' - '${to}')`);

  try {
    const fare: Fare = await calculateFare(from, to);
    return res.send({ fare });
  } catch (err: unknown) {
    const error = err as BackendError;

    req.log.info(error, 'Failed to calculate the fare');

    return res
      .status(error.HTTPStatus)
      .send({ error: { code: error.errorCode, message: error.message } });
  }
}

export default { getFare };
