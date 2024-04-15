import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useCallbackAuthCode from '../hooks/useCallbackAuthCode';
import { PATHS } from './constants';
import { login } from '../features/auth/authSlice';
import { useAppDispatch } from '../app/hooks';

function Callback() {
  const [_, code] = useCallbackAuthCode(); // TODO: error
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // TODO: redux
  useEffect(() => {
    const timerID = window.setTimeout(() => {
      if (code != null) {
        dispatch(login(code)).then(() => {
          navigate(PATHS.ROOT);
        });
      }
    }, 100);

    return () => {
      window.clearTimeout(timerID);
    };
  }, []);

  return null;
}

export default Callback;
