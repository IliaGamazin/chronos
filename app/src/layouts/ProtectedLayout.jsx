import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';

const ProtectedLayout = () => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;