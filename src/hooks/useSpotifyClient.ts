import { useContext } from 'react';

import { SpotifyClientContext } from '../api/SpotifyClientProvider';

function useSpotifyClient() {
  const client = useContext(SpotifyClientContext);

  return client!;
}

export default useSpotifyClient;
