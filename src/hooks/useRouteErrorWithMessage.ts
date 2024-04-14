import { useRouteError } from 'react-router-dom';
import hasOwnProperty from '../utils/has-own-property';

function useRouteErrorWithMessage(): [unknown, string | null] {
  const error = useRouteError();

  let message = null;
  if (error != null && typeof error === 'object') {
    if (
      hasOwnProperty(error, 'statusText') &&
      typeof error.statusText === 'string'
    ) {
      message = error.statusText;
    } else if (error instanceof Error) {
      message = error.message;
    }
  }

  return [error, message];
}

export default useRouteErrorWithMessage;
