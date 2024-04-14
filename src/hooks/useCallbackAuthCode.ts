import { useSearchParams } from 'react-router-dom';

function useCallbackAuthCode() {
  const [params, _] = useSearchParams();
  const code = params.get('code');
  const error = params.get('error');
  return [error, code];
}

export default useCallbackAuthCode;
