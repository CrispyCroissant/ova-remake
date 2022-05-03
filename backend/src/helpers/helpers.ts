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

export { priceCalc };
