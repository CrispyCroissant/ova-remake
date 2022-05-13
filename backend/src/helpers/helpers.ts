import { Customer, Fare } from '../../../shared/types';
import { OrderStatus } from '../types/orderStatuses';

function priceCalc(distance: number): number {
  const distanceKm = Math.round(distance / 1000);
  const flatRate = 1000; // in SEK.
  const kmRate = 20; // in SEK.
  const radius = 25; // in km.
  const taxRate = 1.25;
  let price = 0;

  if (distanceKm > radius) {
    price = Math.round(flatRate + (distanceKm - radius) * kmRate) * taxRate;
  } else {
    price = flatRate * taxRate;
  }

  return price;
}

function createMessage(
  customer: Customer,
  fare: Fare,
  orderId: number,
  status: OrderStatus
): string {
  const { firstName, lastName, address, city, email, phone } = customer;
  const { from, to, price, tax, date, distance } = fare;

  return `
    ID: ${orderId}
    Status: ${status}
    Pris: ${price} (moms: ${tax})
    
    Transportinformation:
      Från: ${from}
      Till: ${to}
      Distans: ${distance / 1000} km
      Datum: ${date}
      
    Kundinformation:
      Org-nummer: ${customer.regNumber ? customer.regNumber : '-'}
      Namn: ${firstName} ${lastName}
      Adress: ${address}
      Ort: ${city}
      E-post: ${email}
      Telefonnummer: ${phone}
`;
}

function createUpdateMsg(orderId: number, status: OrderStatus): string {
  return `
    ID: ${orderId}
    Status: ${status}
  `;
}

export { priceCalc, createMessage, createUpdateMsg };
