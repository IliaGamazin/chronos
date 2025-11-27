import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';

const AuthLayout = () => {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AuthLayout;