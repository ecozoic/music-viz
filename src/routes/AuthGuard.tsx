import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { PATHS } from './constants';

type Props = {
  element: React.JSX.Element;
};

function AuthGuard({ element }: Props) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={PATHS.ROOT} />;
  }

  return element;
}

export default AuthGuard;
