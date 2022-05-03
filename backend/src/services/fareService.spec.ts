import axios from 'axios';

import { calculateFare } from './fareService';
import mockResult from '../../__test__/fareMockResult';
import { Fare, Trip } from '../../../shared/types';

jest.mock('axios');
const mockedAxios = jest.mocked(axios, true);

describe('calculateFare', () => {
  const TOTAL_DISTANCE = 1062683;
  const TOTAL_PRICE = 27200;
  let fare: Fare;

  describe('a successful call', () => {
    beforeEach(async () => {
      mockedAxios.get.mockResolvedValue({
        data: { ...mockResult, status: 'OK' },
      });

      fare = await calculateFare('Stockholm', 'Uppsala');
    });

    it('returns the total distance for the fare', () => {
      expect(fare.distance).toBe(TOTAL_DISTANCE);
    });

    it('returns the total price for the fare', () => {
      expect(fare.price).toBe(TOTAL_PRICE);
    });

    it('returns each trip used in the fare', () => {
      const expectedTrips: Trip[] = [
        {
          distance: 529624,
          from: 'Örnsköldsvik, Sweden',
          to: 'Stockholm, Sweden',
        },
        {
          distance: 70895,
          from: 'Stockholm, Sweden',
          to: 'Uppsala, Sweden',
        },
        {
          distance: 462164,
          from: 'Uppsala, Sweden',
          to: 'Örnsköldsvik, Sweden',
        },
      ];

      expect(fare.trips).toEqual(expectedTrips);
    });

    it('returns the correct tax amount', async () => {
      const tax = TOTAL_PRICE - TOTAL_PRICE * 0.8;
      expect(fare.tax).toBe(tax);
    });
  });

  describe('a unsuccessful call', () => {
    it('throws if the API does not return OK', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { status: 'Literally anything but OK' },
      });

      expect.assertions(1);
      try {
        fare = await calculateFare('Stockholm', 'Uppsala');
      } catch (err: unknown) {
        const error = err as Error;
        expect(typeof error.message).toBe('string');
      }
    });
  });
});
