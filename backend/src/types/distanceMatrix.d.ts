export const enum DistanceMatrixElementStatus {
  OK = 'OK',
  NOT_FOUND = 'NOT_FOUND',
  ZERO_RESULTS = 'ZERO_RESULTS',
  MAX_ROUTE_LENGTH_EXCEEDED = 'MAX_ROUTE_LENGTH_EXCEEDED',
}
export const enum DistanceMatrixStatus {
  OK = 'OK',
  INVALID_REQUEST = 'INVALID_REQUEST',
  MAX_ELEMENTS_EXCEEDED = 'MAX_ELEMENTS_EXCEEDED',
  MAX_DIMENSIONS_EXCEEDED = 'MAX_DIMENSIONS_EXCEEDED',
  OVER_DAILY_LIMIT = 'OVER_DAILY_LIMIT',
  OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
  REQUEST_DENIED = 'REQUEST_DENIED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}
export type TextValueObject = {
  text: string;
  value: number;
};
export type DistanceMatrixElement = {
  status: DistanceMatrixElementStatus;
  distance?: TextValueObject;
  duration?: TextValueObject;
  duration_in_traffic?: TextValueObject;
  fare?: TextValueObject;
};
export type DistanceMatrixRow = {
  elements: [DistanceMatrixElement];
};

export type DistanceMatrixResponse = {
  destination_addresses: [string];
  origin_addresses: [string];
  rows: [DistanceMatrixRow];
  status: DistanceMatrixStatus;
};
