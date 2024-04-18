import { Link, LoaderFunctionArgs, useParams } from 'react-router-dom';
import { QueryClient, useQueries, useQuery } from '@tanstack/react-query';

import SpotifyClient from '../api/client';
import useSpotifyClient from '../hooks/useSpotifyClient';
import { albumQuery, albumColorQuery } from './Album';
import ArtistChart from '../components/ArtistChart';
import { PATHS } from './constants';

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

    await Promise.all(
      simplifiedAlbumsData.items.map((item) => {
        const album = albumQuery(spotifyClient, item.id);
        return queryClient.prefetchQuery(album);
      }),
    );

    return {
      artist: artistData,
      simplifiedAlbums: simplifiedAlbumsData,
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

  const colorResults = useQueries({
    queries: simplifiedAlbumsData!.items.map((item) =>
      albumColorQuery(item.id, item.images[1].url),
    ),
  });

  if (artistIsSuccess && simplifiedAlbumsIsSuccess) {
    const albums = results.map((result) => result.data!);
    return (
      <>
        <div>
          <Link to={PATHS.ROOT}>Home</Link>
        </div>
        <img
          src={artistData.images[1].url}
          height={artistData.images[1].height!}
          width={artistData.images[1].width!}
        />
        <h1>{artistData.name}</h1>
        <div>
          {albums.map((album) => (
            <Link key={album.id} to={PATHS.ALBUM.replace(':albumID', album.id)}>
              {album.name}
            </Link>
          ))}
        </div>
        <ArtistChart albums={albums} />
      </>
    );
  }
}

export default Artist;
