import { Link, LoaderFunctionArgs, useParams } from 'react-router-dom';
import { QueryClient, useQueries, useQuery } from '@tanstack/react-query';
import { FastAverageColor } from 'fast-average-color';

import SpotifyClient from '../api/client';
import useSpotifyClient from '../hooks/useSpotifyClient';
import AlbumChart from '../components/AlbumChart';
import { PATHS } from './constants';

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

export const albumColorQuery = (albumID: string, imageUrl: string) => ({
  queryKey: ['albums', albumID, 'color'],
  queryFn: async () => {
    return await new FastAverageColor().getColorAsync(imageUrl);
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

    await Promise.all(
      simplifiedTracksData.items.map((item) => {
        const track = trackQuery(spotifyClient, item.id);
        return queryClient.prefetchQuery(track);
      }),
    );

    return {
      album: albumData,
      simplifiedTracks: simplifiedTracksData,
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

  const { data: colorData, isSuccess: colorIsSuccess } = useQuery(
    albumColorQuery(params.albumID!, albumData!.images[1].url),
  );

  if (albumIsSuccess && simplifiedTracksIsSuccess && colorIsSuccess) {
    const tracks = results.map((result) => result.data!);
    return (
      <>
        <div>
          <Link to={PATHS.ROOT}>Home</Link>
          <Link to={PATHS.ARTIST.replace(':artistID', albumData.artists[0].id)}>
            {albumData.artists[0].name}
          </Link>
        </div>
        <img
          src={albumData.images[1].url}
          height={albumData.images[1].height!}
          width={albumData.images[1].width!}
        />
        <h1 style={{ color: colorData.hex ?? undefined }}>{albumData.name}</h1>
        <h2>{albumData.release_date}</h2>
        <AlbumChart tracks={tracks} color={colorData.hex} />
      </>
    );
  }
}

export default Album;
