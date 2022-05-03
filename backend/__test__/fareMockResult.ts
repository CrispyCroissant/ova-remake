/* This is a result from the Google Distance Matrix API with the 
  following parameters:

  Origins: [Örnsköldsvik, Stockholm, Upsala]
  Destinations: [Stockholm, Uppsala, Örnsköldsvik]
*/
export default {
  origin_addresses: [
    'Örnsköldsvik, Sweden',
    'Stockholm, Sweden',
    'Uppsala, Sweden',
  ],
  destination_addresses: [
    'Stockholm, Sweden',
    'Uppsala, Sweden',
    'Örnsköldsvik, Sweden',
  ],
  rows: [
    {
      elements: [
        {
          distance: {
            text: '530 km',
            value: 529624,
          },
          duration: {
            text: '6 hours 4 mins',
            value: 21832,
          },
          status: 'OK',
        },
        {
          distance: {
            text: '462 km',
            value: 461754,
          },
          duration: {
            text: '5 hours 21 mins',
            value: 19253,
          },
          status: 'OK',
        },
        {
          distance: {
            text: '1 m',
            value: 0,
          },
          duration: {
            text: '1 min',
            value: 0,
          },
          status: 'OK',
        },
      ],
    },
    {
      elements: [
        {
          distance: {
            text: '1 m',
            value: 0,
          },
          duration: {
            text: '1 min',
            value: 0,
          },
          status: 'OK',
        },
        {
          distance: {
            text: '70.9 km',
            value: 70895,
          },
          duration: {
            text: '59 mins',
            value: 3541,
          },
          status: 'OK',
        },
        {
          distance: {
            text: '528 km',
            value: 528072,
          },
          duration: {
            text: '5 hours 56 mins',
            value: 21344,
          },
          status: 'OK',
        },
      ],
    },
    {
      elements: [
        {
          distance: {
            text: '71.6 km',
            value: 71615,
          },
          duration: {
            text: '1 hour 4 mins',
            value: 3822,
          },
          status: 'OK',
        },
        {
          distance: {
            text: '1 m',
            value: 0,
          },
          duration: {
            text: '1 min',
            value: 0,
          },
          status: 'OK',
        },
        {
          distance: {
            text: '462 km',
            value: 462164,
          },
          duration: {
            text: '5 hours 17 mins',
            value: 19001,
          },
          status: 'OK',
        },
      ],
    },
  ],
  status: 'OK',
};
