import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useCallbackAuthCode from '../hooks/useCallbackAuthCode';
import { getAccessToken } from '../auth/access-token';
import { PATHS } from './constants';

function Callback() {
  const [_, code] = useCallbackAuthCode(); // TODO: error
  const navigate = useNavigate();

  useEffect(() => {
    const requestAccessToken = async () => {
      if (code != null) {
        await getAccessToken(code);
        navigate(PATHS.ROOT);
      }
    };

    requestAccessToken();
  }, [code]);

  return null;
}

export default Callback;
