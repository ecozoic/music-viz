import { LoaderFunctionArgs, useParams } from 'react-router-dom';
import { QueryClient, useQueries, useQuery } from '@tanstack/react-query';

import SpotifyClient from '../api/client';
import useSpotifyClient from '../hooks/useSpotifyClient';
import { albumQuery } from './Album';
import ArtistChart from '../components/ArtistChart';

const artistQuery = (spotifyClient: SpotifyClient, artistID: string) => ({
  queryKey: ['artists', artistID],
  queryFn: async () => {
    return spotifyClient.artistByID(artistID);
  },
});

const albumsQuery = (spotifyClient: SpotifyClient, artistID: string) => ({
  queryKey: ['artists', artistID, 'albums'],
  queryFn: async () => {
    return spotifyClient.albumsByArtistID(artistID, 50);
  },
});

export const loader =
  (spotifyClient: SpotifyClient, queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs<any>) => {
    const artist = artistQuery(spotifyClient, params.artistID!);
    const albums = albumsQuery(spotifyClient, params.artistID!);

    const [artistData, simplifiedAlbumsData] = await Promise.all([
      queryClient.ensureQueryData(artist),
      queryClient.ensureQueryData(albums),
    ]);

    const albumsData = await Promise.all(
      simplifiedAlbumsData.items.map((item) => {
        const album = albumQuery(spotifyClient, item.id);
        return queryClient.ensureQueryData(album);
      }),
    );

    return {
      artist: artistData,
      albums: albumsData,
    };
  };

function Artist() {
  const client = useSpotifyClient();
  const params = useParams();
  const { data: artistData, isSuccess: artistIsSuccess } = useQuery(
    artistQuery(client, params.artistID!),
  );
  const { data: simplifiedAlbumsData, isSuccess: simplifiedAlbumsIsSuccess } =
    useQuery(albumsQuery(client, params.artistID!));

  const results = useQueries({
    queries: simplifiedAlbumsData!.items.map((item) =>
      albumQuery(client, item.id),
    ),
  });

  if (artistIsSuccess && simplifiedAlbumsIsSuccess) {
    const albums = results.map((result) => result.data!);
    return (
      <>
        <img
          src={artistData.images[1].url}
          height={artistData.images[1].height!}
          width={artistData.images[1].width!}
        />
        <h1>{artistData.name}</h1>
        <ArtistChart albums={albums} />
      </>
    );
  }
}

export default Artist;
