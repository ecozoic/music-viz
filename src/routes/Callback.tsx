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

  useEffect(() => {
    const initiateLogin = async () => {
      if (code != null) {
        const result = await dispatch(login(code));
        // conditionally canceled thunk dispatches no action but still resolves promise
        if (result.meta.requestStatus === 'fulfilled') {
          navigate(PATHS.ROOT);
        }
      }
    };

    initiateLogin();
  }, []);

  return null;
}

export default Callback;
