import { LoaderFunctionArgs, useParams } from 'react-router-dom';
import { QueryClient, useQuery } from '@tanstack/react-query';

import SpotifyClient from '../api/client';
import useSpotifyClient from '../hooks/useSpotifyClient';

// https://tkdodo.eu/blog/react-query-meets-react-router

const albumQuery = (spotifyClient: SpotifyClient, albumID: string) => ({
  queryKey: ['albums', albumID],
  queryFn: async () => {
    return spotifyClient.albumByID(albumID);
  },
  staleTime: 10 * 1000,
});

export const loader =
  (spotifyClient: SpotifyClient, queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs<any>) => {
    const query = albumQuery(spotifyClient, params.albumID!);
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

function Album() {
  const client = useSpotifyClient();
  const params = useParams();
  const { data, isSuccess } = useQuery(albumQuery(client, params.albumID!));

  if (isSuccess) {
    return <pre>{JSON.stringify(data.tracks.items)}</pre>;
  }
}

export default Album;
