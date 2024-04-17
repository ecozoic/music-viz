import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

import { Artist as ArtistType } from '../api/client';
import { AppStore } from '../app/store';
import { fromStore } from '../api/factory';

export const loader =
  (store: AppStore) =>
  async ({ params }: LoaderFunctionArgs<any>) => {
    const client = fromStore(store);
    return client.artistByID(params.artistID!);
  };

function Artist() {
  const data = useLoaderData() as ArtistType;
  return <pre>{JSON.stringify(data)}</pre>;
}

export default Artist;
