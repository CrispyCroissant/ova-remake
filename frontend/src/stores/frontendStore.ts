import axios, { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Order } from 'src/types/order';
import { format } from 'quasar';
const { capitalize } = format;

import { Fare, Trip, Customer } from 'app/../shared/types';
import { ErrorCodes } from 'app/../shared/enums';

export const useFrontEndStore = defineStore('frontend', {
  state: () => ({
    customer: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      email: '',
      phone: '',
      regNumber: '',
    } as Customer,
    order: {
      from: '',
      to: '',
      date: '',
      distance: 0,
      trips: [],
      priceNoTax: 0,
      priceTotal: 0,
      tax: 0,
    } as Order,
  }),
  getters: {
    fullName: (state): string => {
      const { firstName, lastName } = state.customer;
      return `${capitalize(firstName)} ${capitalize(lastName)}`;
    },
    priceTotalFormatted: (state): string => {
      const { priceTotal } = state.order;
      return formatPrice(priceTotal);
    },
    priceNoTaxFormatted: (state): string => {
      const { priceNoTax } = state.order;
      return formatPrice(priceNoTax);
    },
    taxFormatted: (state): string => {
      const { tax } = state.order;
      return formatPrice(tax);
    },
  },
  actions: {
    async fetchFare(): Promise<void> {
      try {
        const apiCall = await axios.post(
          `${process.env.BACKEND_URL}/api/fare`,
          {
            from: this.order.from,
            to: this.order.to,
          }
        );

        const fare: Fare = apiCall.data.fare;

        this.order.distance = fare.distance;
        this.order.trips = fare.trips as Trip[];
        this.order.priceTotal = fare.price;
        this.order.priceNoTax = fare.price * 0.8;
        this.order.tax = fare.price - this.order.priceNoTax;
      } catch (err: unknown) {
        const error = err as AxiosError;
        const { response } = error;

        if (response) {
          const { code } = response.data.error;

          switch (code) {
            case ErrorCodes.GOOGLE_INVALID_REQUEST:
            case ErrorCodes.GOOGLE_OVER_LIMIT:
            case ErrorCodes.GOOGLE_REQUEST_DENIED:
            case ErrorCodes.GOOGLE_UNKNOWN_ERROR:
              throw new Error('Ett fel uppstod. Försök igen senare.');
            case ErrorCodes.LOCATION_NOT_FOUND:
              throw new Error('Det gick inte att hitta adressen.');
            case ErrorCodes.LOCATION_NO_RESULT:
              throw new Error('Ingen rutt kunde hittas mellan platserna.');
            case ErrorCodes.LOCATION_ROUTE_TOO_LONG:
              throw new Error('Rutten mellan platserna är för lång.');
            default:
              throw new Error('Ett okänt fel uppstod. Kontakta administratör.');
          }
        } else {
          throw new Error('Kunde inte nå servern. Kontakta administratör.');
        }
      }
    },
  },
});

function formatPrice(number: number): string {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
  }).format(number);
}
