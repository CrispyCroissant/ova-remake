import { Trip } from 'app/../shared/types';

export type Order = {
  from: string;
  to: string;
  date: string;
  distance: number;
  trips: Trip[];
  priceTotal: number;
  priceNoTax: number;
  tax: number;
};

export type DBOrder = {
  id: number;
  locFrom: string;
  locTo: string;
  price: number;
  tax: number;
  customerId: number;
  status: string;
};
