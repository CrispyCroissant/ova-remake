import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: process.env.GOOGLE_API_KEY as string,
  version: 'weekly',
  libraries: ['places'],
  region: 'SE',
  language: 'sv',
});

async function useAutoComplete(
  input: string
): Promise<google.maps.places.AutocompleteResponse | null> {
  const google = await loader.load();
  const service = new google.maps.places.AutocompleteService();

  try {
    const predictions = await service.getPlacePredictions({ input });
    return predictions;
  } catch (err: unknown) {
    return null;
  }
}

export { useAutoComplete };
