import { LoaderFunctionArgs, useParams } from 'react-router-dom';
import { QueryClient, useQuery } from '@tanstack/react-query';

import SpotifyClient from '../api/client';
import useSpotifyClient from '../hooks/useSpotifyClient';

const artistQuery = (spotifyClient: SpotifyClient, artistID: string) => ({
  queryKey: ['artists', artistID],
  queryFn: async () => {
    return spotifyClient.artistByID(artistID);
  },
});

const albumsQuery = (spotifyClient: SpotifyClient, artistID: string) => ({
  queryKey: ['artists', artistID, 'albums'],
  queryFn: async () => {
    return spotifyClient.albumsByArtistID(artistID);
  },
});

export const loader =
  (spotifyClient: SpotifyClient, queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs<any>) => {
    const artist = artistQuery(spotifyClient, params.artistID!);
    const albums = albumsQuery(spotifyClient, params.artistID!);
    return Promise.all([
      queryClient.ensureQueryData(artist),
      queryClient.ensureQueryData(albums),
    ]);
  };

function Artist() {
  const client = useSpotifyClient();
  const params = useParams();
  const { data: artistData, isSuccess: artistIsSuccess } = useQuery(
    artistQuery(client, params.artistID!),
  );
  const { data: albumsData, isSuccess: albumsIsSuccess } = useQuery(
    albumsQuery(client, params.artistID!),
  );

  if (artistIsSuccess && albumsIsSuccess) {
    return (
      <>
        <pre>{JSON.stringify(artistData)}</pre>
        <pre>{JSON.stringify(albumsData)}</pre>
      </>
    );
  }
}

export default Artist;
