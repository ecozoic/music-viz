import { useEffect } from 'react';

import useRouteErrorWithMessage from '../hooks/useRouteErrorWithMessage';

function ErrorPage() {
  const [error, message] = useRouteErrorWithMessage();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occured.</p>
      <p>
        <i>{message}</i>
      </p>
    </div>
  );
}

export default ErrorPage;
