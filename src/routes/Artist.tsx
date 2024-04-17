import { LoaderFunctionArgs, useParams } from 'react-router-dom';
import { QueryClient, useQuery } from '@tanstack/react-query';

import SpotifyClient from '../api/client';
import useSpotifyClient from '../hooks/useSpotifyClient';

const artistQuery = (spotifyClient: SpotifyClient, artistID: string) => ({
  queryKey: ['artists', artistID],
  queryFn: async () => {
    return spotifyClient.artistByID(artistID);
  },
  staleTime: 10 * 1000,
});

export const loader =
  (spotifyClient: SpotifyClient, queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs<any>) => {
    const query = artistQuery(spotifyClient, params.artistID!);
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

function Artist() {
  const client = useSpotifyClient();
  const params = useParams();
  const { data, isSuccess } = useQuery(artistQuery(client, params.artistID!));

  if (isSuccess) {
    return <pre>{JSON.stringify(data)}</pre>;
  }
}

export default Artist;
