import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import {
  useEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from '@/hooks/useEvents';
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
import EventSettings from '@/components/Calendar/EventSettings';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuthContext();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const {
    data: calendarsData,
    isLoading: calendarsLoading,
    error: calendarsError,
  } = useCalendars();

  const calendarIds =
    calendarsData?.data?.map(cal => cal.id || cal._id).filter(Boolean) || [];

  const now = new Date();
  const fromDate = new Date(now.getFullYear() - 5, 0, 1).toISOString();
  const toDate = new Date(now.getFullYear() + 5, 0, 1).toISOString();

  const {
    data: eventsData,
    isLoading: eventsLoading,
    error: eventsError,
  } = useEvents({
    calendars: calendarIds,
    from: fromDate,
    to: toDate,
  });

  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  const createCalendarMutation = useCreateCalendar();
  const createInviteMutation = useCreateInvite();
  const updateCalendarMutation = useUpdateCalendar();
  const deleteCalendarMutation = useDeleteCalendar();
  const unfollowCalendarMutation = useUnfollowCalendar();
  const removeCollaboratorMutation = useRemoveCollaborator();

  const [categories, setCategories] = useState({});
  const [currentView, setCurrentView] = useState('calendar');
  const [selectedCalendarForEdit, setSelectedCalendarForEdit] = useState(null);
  const [selectedEventForEdit, setSelectedEventForEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (calendarsData?.data) {
      const calendarCategories = {};
      calendarsData.data.forEach(calendar => {
        const key = calendar.id || calendar._id;
        if (key) {
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
        }
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
    setSelectedEventForEdit(null);
  };

  const handleUpdateCalendar = updateData => {
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

  const handleDeleteCalendar = calendarId => {
    deleteCalendarMutation.mutate(calendarId, {
      onSuccess: () => handleBackToCalendar(),
    });
  };

  const handleUnfollowCalendar = calendarId => {
    unfollowCalendarMutation.mutate(calendarId, {
      onSuccess: () => handleBackToCalendar(),
    });
  };

  const handleRemoveCollaborator = data => {
    removeCollaboratorMutation.mutate(data);
  };

  const handleEventEditRequest = event => {
    setSelectedEventForEdit(event);
    setCurrentView('event-settings');
  };

  const handleUpdateEvent = ({ eventId, eventData }) => {
    updateEventMutation.mutate(
      { eventId, eventData },
      {
        onSuccess: () => {
          const updatedEvent = {
            ...selectedEventForEdit,
            title: eventData.name,
            backgroundColor: eventData.color,
          };
          setSelectedEventForEdit(updatedEvent);
        },
      }
    );
  };

  const handleDeleteEvent = eventId => {
    deleteEventMutation.mutate(eventId, {
      onSuccess: () => {
        handleBackToCalendar();
      },
    });
  };

  const canEditEvent = event => {
    if (!event) return false;
    const calendarData = event.extendedProps?.calendar;
    const calId = calendarData?._id || calendarData?.id || calendarData;
    const role = categories[calId]?.role;
    return role === 'owner' || role === 'editor';
  };

  const events = eventsData?.data || [];

  const visibleEvents = events
    .filter(event => {
      const calendarData = event.extendedProps?.calendar;
      const calendarId = calendarData?._id || calendarData?.id || calendarData;
      if (!calendarId || !categories[calendarId]) return true;
      return categories[calendarId].visible;
    })
    .map(event => {
      const calendarData = event.extendedProps?.calendar;
      const calendarId = calendarData?._id || calendarData?.id || calendarData;
      const category = categories[calendarId];

      return {
        ...event,
        backgroundColor: category?.color || '#3788d8',
        borderColor: category?.color || '#3788d8',
        textColor: '#ffffff',
        display: 'block',
      };
    });

  if (calendarsLoading)
    return (
      <div className="dashboard">
        <div className="loading-message">Loading...</div>
      </div>
    );
  if (calendarsError)
    return (
      <div className="dashboard">
        <div className="error-message">Error: {calendarsError.message}</div>
      </div>
    );

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Chronos Dashboard</h1>
        <div className="user-info">
          <span className="welcome-text">Welcome, {user?.full_name}!</span>
          <CustomButton
            onClick={logout}
            variant="secondary"
            className="logout-button"
          >
            Logout
          </CustomButton>
          <CustomButton
            onClick={() => navigate('/profile')}
            variant="secondary"
            className="profile-button"
          >
            Profile
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
            setIsModalOpen={setIsModalOpen}
          />

          {currentView === 'calendar' && (
            <CalendarWrapper
              eventSource={visibleEvents}
              categories={categories}
              onCreateEvent={createEventMutation.mutate}
              isCreatingEvent={createEventMutation.isPending}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              onEventEditRequest={handleEventEditRequest}
            />
          )}

          {currentView === 'settings' && selectedCalendarForEdit && (
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

          {currentView === 'event-settings' && selectedEventForEdit && (
            <EventSettings
              event={selectedEventForEdit}
              onBack={handleBackToCalendar}
              onUpdate={handleUpdateEvent}
              onDelete={handleDeleteEvent}
              isUpdating={updateEventMutation.isPending}
              isDeleting={deleteEventMutation.isPending}
              canEdit={canEditEvent(selectedEventForEdit)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
