import axios, { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { DBOrder } from 'src/types/order';
import { useFrontEndStore } from './frontendStore';
import { ErrorCodes } from 'app/../shared/enums';

export const useBackendStore = defineStore('backend', {
  state: () => ({
    orderId: 0,
    price: 0,
    tax: 0,
    customerId: 0,
  }),
  getters: {},
  actions: {
    async saveOrder(): Promise<void> {
      const frontendStore = useFrontEndStore();

      try {
        const apiCall = await axios.post(
          `${process.env.BACKEND_URL}/api/order`,
          {
            fare: { ...frontendStore.order },
            customer: { ...frontendStore.customer },
          }
        );

        const data: DBOrder = apiCall.data.order;
        const { id, price, tax, customerId } = data;

        this.orderId = id;
        this.price = price;
        this.tax = tax;
        this.customerId = customerId;
      } catch (err: unknown) {
        const error = err as AxiosError;
        const { response } = error;

        if (response) {
          const { code } = response.data.error;

          switch (code) {
            case ErrorCodes.DB_CANT_SAVE:
              throw new Error('Kunde inte spara din order, försök igen senare');
            case ErrorCodes.ROUTE_MISSING_PARAMS:
              throw new Error(
                'Ett fel uppstod när din order skickades, kontakta administratör.'
              );
            default:
              throw new Error('Ett fel uppstod, försök igen senare.');
          }
        } else {
          throw new Error('Kunde inte nå servern. Kontakta administratör.');
        }
      }
    },
  },
});
