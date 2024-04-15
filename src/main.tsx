import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.tsx';
import ErrorPage from './routes/ErrorPage.tsx';
import { PATHS } from './routes/constants.ts';
import Callback from './routes/Callback.tsx';
import { store } from './app/store';
import { Provider } from 'react-redux';

import './index.css';

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
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
