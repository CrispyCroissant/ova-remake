import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { setActivePinia, createPinia } from 'pinia';
import axios from 'axios';

import { useBackendStore } from './backendStore';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('The order store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('state', () => {
    it('stores the order ID', () => {
      const { orderId } = useBackendStore();
      expect(orderId).toBe(0);
    });

    it('stores the price', () => {
      const { price } = useBackendStore();
      expect(price).toBe(0);
    });

    it('stores the tax amount', () => {
      const { tax } = useBackendStore();
      expect(tax).toBe(0);
    });

    it('stores the customer ID', () => {
      const { customerId } = useBackendStore();
      expect(customerId).toBe(0);
    });
  });

  describe('saveOrder', () => {
    describe('on successful calls', () => {
      beforeEach(() => {
        mockedAxios.post.mockResolvedValueOnce({
          data: { order: { id: 1, price: 123, tax: 55, customerId: 2 } },
        });
      });

      it('sets the orderId', async () => {
        const store = useBackendStore();
        await store.saveOrder();
        expect(store.orderId).toBe(1);
      });
      it('sets the price', async () => {
        const store = useBackendStore();
        await store.saveOrder();
        expect(store.price).toBe(123);
      });
      it('sets the tax', async () => {
        const store = useBackendStore();
        await store.saveOrder();
        expect(store.tax).toBe(55);
      });
      it('sets the customer ID', async () => {
        const store = useBackendStore();
        await store.saveOrder();
        expect(store.customerId).toBe(2);
      });
    });

    describe('on an unsuccessful call', () => {
      it("throws an error if the order wasn't saved", async () => {
        mockedAxios.post.mockRejectedValueOnce(null);

        const { saveOrder } = useBackendStore();

        expect.assertions(1);
        try {
          await saveOrder();
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });
});
