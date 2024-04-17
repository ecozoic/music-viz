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
});

const tracksQuery = (spotifyClient: SpotifyClient, albumID: string) => ({
  queryKey: ['albums', albumID, 'tracks'],
  queryFn: async () => {
    return spotifyClient.tracksByAlbumID(albumID);
  },
});

export const loader =
  (spotifyClient: SpotifyClient, queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs<any>) => {
    const album = albumQuery(spotifyClient, params.albumID!);
    const tracks = tracksQuery(spotifyClient, params.albumID!);
    return Promise.all([
      queryClient.ensureQueryData(album),
      queryClient.ensureQueryData(tracks),
    ]);
  };

function Album() {
  const client = useSpotifyClient();
  const params = useParams();
  const { data: albumData, isSuccess: albumIsSuccess } = useQuery(
    albumQuery(client, params.albumID!),
  );
  const { data: tracksData, isSuccess: tracksIsSuccess } = useQuery(
    tracksQuery(client, params.albumID!),
  );

  if (albumIsSuccess && tracksIsSuccess) {
    return (
      <>
        <pre>{JSON.stringify(albumData)}</pre>
        <pre>{JSON.stringify(tracksData)}</pre>
      </>
    );
  }
}

export default Album;
