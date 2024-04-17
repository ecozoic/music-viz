import { useMemo } from 'react';
import { Chart, AxisOptions } from 'react-charts';

import { Album } from '../api/client';

type Props = {
  albums: ReadonlyArray<Album>;
};

type AlbumPopularity = {
  date: Date;
  popularity: number;
};

type Series = {
  label: string;
  data: AlbumPopularity[];
};

function ArtistChart({ albums }: Props) {
  const data = useMemo((): AlbumPopularity[] => {
    return albums.map((album) => ({
      date: new Date(album.release_date),
      popularity: album.popularity,
    }));
  }, [albums]);
  const series = useMemo((): Series[] => {
    return [
      {
        label: 'Popularity',
        data,
      },
    ];
  }, [data]);
  const primaryAxis = useMemo(
    (): AxisOptions<AlbumPopularity> => ({
      getValue: (datum) => datum.date,
    }),
    [],
  );
  const secondaryAxes = useMemo(
    (): AxisOptions<AlbumPopularity>[] => [
      {
        getValue: (datum) => datum.popularity,
      },
    ],
    [],
  );

  return <Chart options={{ data: series, primaryAxis, secondaryAxes }} />;
}

export default ArtistChart;
