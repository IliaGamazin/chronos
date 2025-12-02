import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { useEvents, useCreateEvent } from '@/hooks/useEvents';
import { useCalendars, useCreateCalendar } from '@/hooks/useCalendars';
import { useCreateInvite } from '@/hooks/useInvites';
import CustomButton from '@/shared/CustomButton';
import CalendarWrapper from '@/components/Calendar/CalendarWrapper';
import { backendToFullCalendar } from '@/utils/eventMapping';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuthContext();
  const { logout } = useAuth();

  const { data: eventsData, isLoading: eventsLoading, error: eventsError } = useEvents();
  const { data: calendarsData, isLoading: calendarsLoading, error: calendarsError } = useCalendars();
  const createEventMutation = useCreateEvent();
  const createCalendarMutation = useCreateCalendar();
  const createInviteMutation = useCreateInvite();

  const [categories, setCategories] = useState({});

  useEffect(() => {
    if (calendarsData?.data) {
      const calendarCategories = {};
      calendarsData.data.forEach(calendar => {
        const key = calendar.id || calendar._id;
        calendarCategories[key] = {
          name: calendar.name,
          color: calendar.color,
          borderColor: calendar.color,
          visible: true,
          editors: calendar.editors,
        };
      });
      setCategories(calendarCategories);
    }
  }, [calendarsData]);

  const handleToggleCategory = categoryKey => {
    setCategories(prev => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        visible: !prev[categoryKey].visible,
      },
    }));
  };

  const events = eventsData?.data || [];

  const visibleEvents = events
    .filter(event => categories[event.calendar]?.visible)
    .map(event => backendToFullCalendar(event, categories));

  const isLoading = eventsLoading || calendarsLoading;
  const error = eventsError || calendarsError;

  if (isLoading) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Chronos Dashboard</h1>
          <div className="user-info">
            <span className="welcome-text">Welcome, {user?.full_name}!</span>
            <CustomButton onClick={logout} variant="secondary" className="logout-button">
              Logout
            </CustomButton>
          </div>
        </header>
        <main className="dashboard-content">
          <div className="loading-message">Loading events...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Chronos Dashboard</h1>
          <div className="user-info">
            <span className="welcome-text">Welcome, {user?.full_name}!</span>
            <CustomButton onClick={logout} variant="secondary" className="logout-button">
              Logout
            </CustomButton>
          </div>
        </header>
        <main className="dashboard-content">
          <div className="error-message">
            Error loading events: {error.message}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Chronos Dashboard</h1>
        <div className="user-info">
          <span className="welcome-text">Welcome, {user?.full_name}!</span>
          <CustomButton onClick={logout} variant="secondary" className="logout-button">
            Logout
          </CustomButton>
        </div>
      </header>
      <main className="dashboard-content">
        <CalendarWrapper
          events={visibleEvents}
          categories={categories}
          onToggleCategory={handleToggleCategory}
          onCreateEvent={createEventMutation.mutate}
          isCreatingEvent={createEventMutation.isPending}
          onCreateCalendar={createCalendarMutation.mutate}
          isCreatingCalendar={createCalendarMutation.isPending}
          onCreateInvite={createInviteMutation.mutateAsync}
          isCreatingInvite={createInviteMutation.isPending}
        />
      </main>
    </div>
  );
};

export default DashboardPage;
