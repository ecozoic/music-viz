import { createContext } from 'react';

import SpotifyClient from './client';

type Props = {
  children: React.ReactNode;
  client: SpotifyClient;
};

export const SpotifyClientContext = createContext<SpotifyClient | null>(null);

function SpotifyClientProvider({ children, client }: Props) {
  return (
    <SpotifyClientContext.Provider value={client}>
      {children}
    </SpotifyClientContext.Provider>
  );
}

export default SpotifyClientProvider;
