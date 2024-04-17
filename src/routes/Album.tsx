import { LoaderFunctionArgs, useParams } from 'react-router-dom';
import { QueryClient, useQueries, useQuery } from '@tanstack/react-query';

import SpotifyClient from '../api/client';
import useSpotifyClient from '../hooks/useSpotifyClient';
import AlbumChart from '../components/AlbumChart';

// https://tkdodo.eu/blog/react-query-meets-react-router

export const albumQuery = (spotifyClient: SpotifyClient, albumID: string) => ({
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

const trackQuery = (spotifyClient: SpotifyClient, trackID: string) => ({
  queryKey: ['tracks', trackID],
  queryFn: async () => {
    return spotifyClient.trackByID(trackID);
  },
});

export const loader =
  (spotifyClient: SpotifyClient, queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs<any>) => {
    const album = albumQuery(spotifyClient, params.albumID!);
    const tracks = tracksQuery(spotifyClient, params.albumID!);

    const [albumData, simplifiedTracksData] = await Promise.all([
      queryClient.ensureQueryData(album),
      queryClient.ensureQueryData(tracks),
    ]);

    const tracksData = await Promise.all(
      simplifiedTracksData.items.map((item) => {
        const track = trackQuery(spotifyClient, item.id);
        return queryClient.ensureQueryData(track);
      }),
    );

    return {
      album: albumData,
      tracks: tracksData,
    };
  };

function Album() {
  const client = useSpotifyClient();
  const params = useParams();
  const { data: albumData, isSuccess: albumIsSuccess } = useQuery(
    albumQuery(client, params.albumID!),
  );
  const { data: simplifiedTracksData, isSuccess: simplifiedTracksIsSuccess } =
    useQuery(tracksQuery(client, params.albumID!));

  const results = useQueries({
    queries: simplifiedTracksData!.items.map((item) =>
      trackQuery(client, item.id),
    ),
  });

  if (albumIsSuccess && simplifiedTracksIsSuccess) {
    const tracks = results.map((result) => result.data!);
    return (
      <>
        <img
          src={albumData.images[1].url}
          height={albumData.images[1].height!}
          width={albumData.images[1].width!}
        />
        <h1>{albumData.name}</h1>
        <h2>{albumData.release_date}</h2>
        <AlbumChart tracks={tracks} />
      </>
    );
  }
}

export default Album;
