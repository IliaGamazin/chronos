import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { useEvents, useCreateEvent } from '@/hooks/useEvents';
import {
  useCalendars,
  useCreateCalendar,
  useUpdateCalendar,
  useDeleteCalendar,
  useUnfollowCalendar,
  useRemoveCollaborator,
} from '@/hooks/useCalendars';
import { useCreateInvite } from '@/hooks/useInvites';
import CustomButton from '@/shared/CustomButton';
import CalendarWrapper from '@/components/Calendar/CalendarWrapper';
import CalendarSidebar from '@/components/Calendar/CalendarSidebar';
import CalendarSettings from '@/components/Calendar/CalendarSettings';
import { backendToFullCalendar } from '@/utils/eventMapping';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuthContext();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const { data: eventsData, isLoading: eventsLoading, error: eventsError } = useEvents();
  const { data: calendarsData, isLoading: calendarsLoading, error: calendarsError } = useCalendars();
  const createEventMutation = useCreateEvent();
  const createCalendarMutation = useCreateCalendar();
  const createInviteMutation = useCreateInvite();
  const updateCalendarMutation = useUpdateCalendar();
  const deleteCalendarMutation = useDeleteCalendar();
  const unfollowCalendarMutation = useUnfollowCalendar();
  const removeCollaboratorMutation = useRemoveCollaborator();

  const [categories, setCategories] = useState({});
  const [currentView, setCurrentView] = useState('calendar');
  const [selectedCalendarForEdit, setSelectedCalendarForEdit] = useState(null);

  useEffect(() => {
    if (calendarsData?.data) {
      const calendarCategories = {};
      calendarsData.data.forEach(calendar => {
        const key = calendar.id || calendar._id;
        calendarCategories[key] = {
          id: key,
          name: calendar.name,
          description: calendar.description,
          color: calendar.color,
          borderColor: calendar.color,
          visible: true,
          editors: calendar.editors,
          followers: calendar.followers,
          role: calendar.role || 'owner',
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

  const handleOpenCalendarSettings = (calendarId, calendarData) => {
    setSelectedCalendarForEdit({ id: calendarId, ...calendarData });
    setCurrentView('settings');
  };

  const handleBackToCalendar = () => {
    setCurrentView('calendar');
    setSelectedCalendarForEdit(null);
  };

  const handleUpdateCalendar = (updateData) => {
    updateCalendarMutation.mutate(updateData, {
      onSuccess: () => {
        setCategories(prev => ({
          ...prev,
          [updateData.calendarId]: {
            ...prev[updateData.calendarId],
            ...updateData.calendarData,
          },
        }));
        setSelectedCalendarForEdit(prev => ({
          ...prev,
          ...updateData.calendarData,
        }));
      },
    });
  };

  const handleDeleteCalendar = (calendarId) => {
    console.log('[Dashboard] handleDeleteCalendar called with:', calendarId);
    deleteCalendarMutation.mutate(calendarId, {
      onSuccess: () => {
        console.log('[Dashboard] Delete successful, navigating back');
        handleBackToCalendar();
      },
      onError: (error) => {
        console.error('[Dashboard] Delete failed:', error);
      },
    });
  };

  const handleUnfollowCalendar = (calendarId) => {
    unfollowCalendarMutation.mutate(calendarId, {
      onSuccess: () => {
        handleBackToCalendar();
      },
    });
  };

  const handleRemoveCollaborator = (data) => {
    removeCollaboratorMutation.mutate(data);
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
            <CustomButton onClick={() => navigate("/profile")} variant="secondary" className="profile-button">
              Profile
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
        <div className="calendar-wrapper">
          <CalendarSidebar
            categories={categories}
            onToggleCategory={handleToggleCategory}
            onCreateCalendar={createCalendarMutation.mutate}
            isCreatingCalendar={createCalendarMutation.isPending}
            onCreateInvite={createInviteMutation.mutateAsync}
            isCreatingInvite={createInviteMutation.isPending}
            onOpenCalendarSettings={handleOpenCalendarSettings}
          />
          {currentView === 'calendar' ? (
            <CalendarWrapper
              events={visibleEvents}
              categories={categories}
              onCreateEvent={createEventMutation.mutate}
              isCreatingEvent={createEventMutation.isPending}
            />
          ) : (
            <CalendarSettings
              calendar={selectedCalendarForEdit}
              onBack={handleBackToCalendar}
              onUpdate={handleUpdateCalendar}
              onDelete={handleDeleteCalendar}
              onUnfollow={handleUnfollowCalendar}
              onRemoveCollaborator={handleRemoveCollaborator}
              isUpdating={updateCalendarMutation.isPending}
              isDeleting={deleteCalendarMutation.isPending}
              isUnfollowing={unfollowCalendarMutation.isPending}
              isRemovingCollaborator={removeCollaboratorMutation.isPending}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
