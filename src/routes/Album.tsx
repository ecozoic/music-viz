import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

import { Album as AlbumType } from '../api/client';
import { AppStore } from '../app/store';
import { fromStore } from '../api/factory';

export const loader =
  (store: AppStore) =>
  async ({ params }: LoaderFunctionArgs<any>) => {
    const client = fromStore(store);
    return client.albumByID(params.albumID!);
  };

function Album() {
  const data = useLoaderData() as AlbumType;
  return <pre>{JSON.stringify(data.tracks.items)}</pre>;
}

export default Album;
