import axios from 'axios';
import { Fare, Trip } from '../../../shared/types';
import {
  DistanceMatrixResponse,
  DistanceMatrixStatus,
  DistanceMatrixElementStatus,
  DistanceMatrixElement,
} from '../types/distanceMatrix';
import { priceCalc } from '../helpers/helpers';
import { BackendError } from '../../../shared/BackendError';
import { ErrorCodes } from '../../../shared/enums';

async function calculateFare(from: string, to: string): Promise<Fare> {
  const API_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json';
  const GARAGE_LOC = 'Örnsköldsvik, Sweden';

  try {
    const apiCall = await axios.get(API_URL, {
      params: {
        origins: `${GARAGE_LOC}|${from}|${to}`,
        destinations: `${from}|${to}|${GARAGE_LOC}`,
        language: 'sv',
        key: process.env.GOOGLE_API_KEY,
      },
    });
    const result: DistanceMatrixResponse = apiCall.data;

    switch (result.status) {
      case DistanceMatrixStatus.INVALID_REQUEST:
        throw new BackendError(
          500,
          ErrorCodes.GOOGLE_INVALID_REQUEST,
          "Google's API failed the request."
        );
      case DistanceMatrixStatus.OVER_DAILY_LIMIT:
        throw new BackendError(
          500,
          ErrorCodes.GOOGLE_OVER_LIMIT,
          "Google's API usage is over daily limit."
        );
      case DistanceMatrixStatus.OVER_QUERY_LIMIT:
        throw new BackendError(
          500,
          ErrorCodes.GOOGLE_OVER_LIMIT,
          'Too many recent API calls have been made.'
        );
      case DistanceMatrixStatus.REQUEST_DENIED:
        throw new BackendError(
          500,
          ErrorCodes.GOOGLE_REQUEST_DENIED,
          'Google denied the use of the API.'
        );
      case DistanceMatrixStatus.UNKNOWN_ERROR:
        throw new BackendError(
          500,
          ErrorCodes.GOOGLE_UNKNOWN_ERROR,
          'UNKNOWN_ERROR returned by Google.'
        );
      case DistanceMatrixStatus.OK:
        break;
      default:
        throw new BackendError(
          500,
          ErrorCodes.GOOGLE_UNKNOWN_ERROR,
          'An unknown error occured with Google.'
        );
    }

    const trips: Trip[] = [];
    let totalDistance = 0;

    /* Add trips to fare */
    result.origin_addresses.forEach((origin, i) => {
      const from = origin;
      const to = result.destination_addresses[i];
      const element: DistanceMatrixElement = result.rows[i].elements[i];

      switch (element.status) {
        case DistanceMatrixElementStatus.NOT_FOUND:
          throw new BackendError(
            400,
            ErrorCodes.LOCATION_NOT_FOUND,
            'At least one location was not found.'
          );
        case DistanceMatrixElementStatus.ZERO_RESULTS:
          throw new BackendError(
            400,
            ErrorCodes.LOCATION_NO_RESULT,
            'No route could be found.'
          );
        case DistanceMatrixElementStatus.MAX_ROUTE_LENGTH_EXCEEDED:
          throw new BackendError(
            400,
            ErrorCodes.LOCATION_ROUTE_TOO_LONG,
            'Requested route is too long'
          );
        case DistanceMatrixElementStatus.OK:
          break;
      }

      trips.push({ from, to, distance: element.distance?.value as number });
      totalDistance += element.distance?.value as number;
    });

    const price: number = priceCalc(totalDistance);
    const fare: Fare = {
      from,
      to,
      distance: totalDistance,
      price,
      tax: price - price * 0.8,
      trips,
    };

    return fare;
  } catch (err: unknown) {
    const error = err as Error;
    throw error;
  }
}

export { calculateFare };
