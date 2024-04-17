import { useMemo } from 'react';
import { Chart, AxisOptions } from 'react-charts';

import { Track } from '../api/client';

type Props = {
  tracks: ReadonlyArray<Track>;
};

type TrackPopularity = {
  number: number;
  popularity: number;
};

type Series = {
  label: string;
  data: TrackPopularity[];
};

function AlbumChart({ tracks }: Props) {
  const data = useMemo((): TrackPopularity[] => {
    return tracks.map((track) => ({
      number: track.track_number,
      popularity: track.popularity,
    }));
  }, [tracks]);
  const series = useMemo((): Series[] => {
    return [
      {
        label: 'Popularity',
        data,
      },
    ];
  }, [data]);
  const primaryAxis = useMemo(
    (): AxisOptions<TrackPopularity> => ({
      getValue: (datum) => datum.number,
    }),
    [],
  );
  const secondaryAxes = useMemo(
    (): AxisOptions<TrackPopularity>[] => [
      {
        getValue: (datum) => datum.popularity,
      },
    ],
    [],
  );

  return <Chart options={{ data: series, primaryAxis, secondaryAxes }} />;
}

export default AlbumChart;
