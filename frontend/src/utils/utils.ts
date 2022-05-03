import { useFrontEndStore } from 'src/stores/frontendStore';

export function required(val: string): boolean | string {
  return !!val || 'Obligatoriskt fält';
}

export function validEmail(email: string): boolean | string {
  const emailPattern =
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
  return emailPattern.test(email) || 'Ogiltig e-postadress';
}

export function sameEmail(email: string): boolean | string {
  const { customer } = useFrontEndStore();
  return email === customer.email ? true : 'Postadressen är inte likadan';
}

export function formatLocation(location: string): string {
  const zipCodeRegex = /[0-9]+\s[0-9]+\s/;

  const newLoc = location.replace(zipCodeRegex, '');
  return newLoc.replace(', Sverige', '');
}
