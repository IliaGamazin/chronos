import { useAuthContext } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import './DashboardPage.css';
import Schedule from '../../components/Schedule/Schedule';

const DashboardPage = () => {
  const { user } = useAuthContext();
  const { logout } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Chronos Dashboard</h1>
        <div className="user-info">
          <span className="welcome-text">Welcome, {user?.full_name}!</span>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </header>
      <main className="dashboard-content">
        <div className="schedule-calendar">
          <Schedule />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
