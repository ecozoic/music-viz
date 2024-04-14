import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.tsx';
import ErrorPage from './routes/ErrorPage.tsx';
import { PATHS } from './routes/constants.ts';
import Callback from './routes/Callback.tsx';

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
    <RouterProvider router={router} />
  </React.StrictMode>,
);
