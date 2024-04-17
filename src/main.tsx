import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App.tsx';
import ErrorPage from './routes/ErrorPage.tsx';
import { PATHS } from './routes/constants.ts';
import Callback from './routes/Callback.tsx';
import Artist, { loader as artistLoader } from './routes/Artist.tsx';
import Album, { loader as albumLoader } from './routes/Album.tsx';
import { store } from './app/store';
import { fromStore } from './api/factory.ts';

import './index.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// TODO: auth guard https://developer.auth0.com/resources/guides/spa/react/basic-authentication#add-route-guards-to-react
// TODO: react query https://tkdodo.eu/blog/react-query-meets-react-router
// TODO: search
// TODO: charts https://react-charts.tanstack.com/

const queryClient = new QueryClient();
const spotifyClient = fromStore(store);

const router = createBrowserRouter([
  {
    path: PATHS.ROOT,
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: PATHS.CALLBACK,
    element: <Callback />,
  },
  {
    path: PATHS.ARTIST,
    element: <Artist />,
    loader: artistLoader(spotifyClient, queryClient),
  },
  {
    path: PATHS.ALBUM,
    element: <Album />,
    loader: albumLoader(spotifyClient, queryClient),
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);
