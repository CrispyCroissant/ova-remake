export type Fare = {
  from: string;
  to: string;
  date?: string;
  distance: number;
  price: number;
  tax: number;
  trips?: Trip[];
};

export type Trip = {
  from: string;
  to: string;
  distance: number;
};

export type Customer = {
  regNumber?: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  phone: string;
  email: string;
};
