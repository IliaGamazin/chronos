import { useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import CalendarWrapper from '@/components/Calendar/CalendarWrapper';
import { mockEvents, calendarCategories } from '@/utils/mockCalendarData';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuthContext();
  const { logout } = useAuth();

  const [categories, setCategories] = useState(() => {
    const initialCategories = {};
    Object.keys(calendarCategories).forEach(key => {
      initialCategories[key] = {
        ...calendarCategories[key],
        visible: true,
      };
    });
    return initialCategories;
  });

  const handleToggleCategory = categoryKey => {
    setCategories(prev => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        visible: !prev[categoryKey].visible,
      },
    }));
  };

  const visibleEvents = mockEvents
    .filter(event => categories[event.calendar]?.visible)
    .map(event => {
      const category = calendarCategories[event.calendar];
      return {
        ...event,
        backgroundColor: category.color,
        borderColor: category.borderColor,
        display: 'block',
      };
    });

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
        <CalendarWrapper
          events={visibleEvents}
          categories={categories}
          onToggleCategory={handleToggleCategory}
        />
      </main>
    </div>
  );
};

export default DashboardPage;
