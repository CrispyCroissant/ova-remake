import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { setActivePinia, createPinia } from 'pinia';
import axios, { AxiosError } from 'axios';

import { useFrontEndStore } from './frontendStore';
import { Fare } from 'app/../shared/types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('The order store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('state', () => {
    it('stores customer info', () => {
      const { customer } = useFrontEndStore();

      expect(customer).toBeTruthy();
    });

    it('stores order info', () => {
      const { order } = useFrontEndStore();

      expect(order).toBeTruthy();
    });
  });

  describe('getters', () => {
    it('can return a customers capitalized full name', () => {
      const store = useFrontEndStore();

      store.$patch((state) => {
        state.customer.firstName = 'john';
        state.customer.lastName = 'doe';
      });

      expect(store.fullName).toBe('John Doe');
    });

    it('can return a formatted total price', () => {
      const store = useFrontEndStore();

      store.$patch((state) => {
        state.order.priceTotal = 15345;
      });

      // The string contains non-breaking spaces: \xa0
      expect(store.priceTotalFormatted).toBe('15\xa0345\xa0kr');
    });

    it('can return a formatted untaxed price', () => {
      const store = useFrontEndStore();

      store.$patch((state) => {
        state.order.priceNoTax = 13123;
      });

      // The string contains non-breaking spaces: \xa0
      expect(store.priceNoTaxFormatted).toBe('13\xa0123\xa0kr');
    });

    it('can return a formatted tax', () => {
      const store = useFrontEndStore();

      store.$patch((state) => {
        state.order.tax = 2123;
      });

      // The string contains non-breaking spaces: \xa0
      expect(store.taxFormatted).toBe('2\xa0123\xa0kr');
    });
  });

  describe('actions', () => {
    describe('fetchFare', () => {
      let mockFare: Fare;

      beforeEach(() => {
        mockFare = {
          from: '',
          to: '',
          distance: 123,
          trips: [{ distance: 1, from: 'here', to: 'there' }],
          price: 10000,
          tax: 0,
        };
        mockedAxios.post.mockResolvedValueOnce({
          data: { fare: mockFare },
          status: 200,
        });
      });

      it('gets the total price for the transport', async () => {
        const { order, fetchFare } = useFrontEndStore();
        await fetchFare();

        expect(order.priceTotal).toBe(10000);
      });

      it('calculates the total price without tax', async () => {
        const { order, fetchFare } = useFrontEndStore();
        await fetchFare();
        expect(order.priceNoTax).toBe(8000);
      });

      it('gets the distance for the transport', async () => {
        const { order, fetchFare } = useFrontEndStore();
        await fetchFare();

        expect(order.distance).toBe(123);
      });

      it('gets all trips in the transport', async () => {
        const { order, fetchFare } = useFrontEndStore();
        await fetchFare();

        expect(order.trips[0]).toEqual({
          distance: 1,
          from: 'here',
          to: 'there',
        });
      });

      it('calculates the tax amount', async () => {
        const { order, fetchFare } = useFrontEndStore();
        await fetchFare();

        expect(order.tax).toBe(2000);
      });

      it('throws an error if the status code is not 200', async () => {
        jest.resetAllMocks();
        mockedAxios.post.mockResolvedValueOnce({ data: {}, status: 400 });

        const { fetchFare } = useFrontEndStore();

        expect.assertions(1);
        try {
          await fetchFare();
        } catch (err: unknown) {
          const error = err as AxiosError | Error;
          expect(error.message).toBeTruthy();
        }
      });
    });

    /* describe('saveOrder', () => {
      it("throws an error if the order wasn't saved", async () => {
        mockedAxios.post.mockResolvedValueOnce();

        const { saveOrder } = useStore();

        expect.assertions(1);
        try {
          await saveOrder();
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    }); */
  });
});
