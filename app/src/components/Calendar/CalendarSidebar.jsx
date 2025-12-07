import { useState } from 'react';
import { Plus, Mail } from 'lucide-react';
import IconButton from '@/shared/IconButton';
import CustomButton from '@/shared/CustomButton';
import CalendarListItem from './CalendarListItem';
import InviteModal from './InviteModal';
import CalendarModal from './CalendarModal';

const CalendarSidebar = ({
  categories,
  onToggleCategory,
  onCreateCalendar,
  isCreatingCalendar,

  onCreateInvite,
  onSendInviteEmail,
  isCreatingInvite,

  onOpenCalendarSettings,
  setIsModalOpen,
}) => {
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  const handleCreateCalendar = calendarData => {
    onCreateCalendar(calendarData);
    setIsCalendarModalOpen(false);
  };

  const handleCreateInvite = async inviteData => {
    try {
      const safeRole = (inviteData.role || 'follower').toLowerCase();

      const response = await onCreateInvite({
        calendarId: inviteData.calendar,
        role: safeRole,
      });

      const token = response.data || response;

      if (token && typeof token === 'string') {
        const link = `${window.location.origin}/invite/${token}`;
        setInviteLink(link);

        if (inviteData.email && inviteData.email.trim() !== '') {
          await onSendInviteEmail({
            email: inviteData.email,
            link: link,
          });
          alert(`Invitation sent to ${inviteData.email}`);
        }
      } else {
        console.error('Token not found in response', response);
      }
    } catch (error) {
      console.error('Failed to create invite:', error);

      if (error.response?.data?.error?.message) {
        alert(`Error: ${error.response.data.error.message}`);
      } else {
        alert('Error creating invitation. Please check console.');
      }
    }
  };

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
    setInviteLink('');
  };

  const handleEditCalendar = (calendarKey, calendar) => {
    onOpenCalendarSettings(calendarKey, calendar);
  };

  return (
    <aside className="calendar-sidebar">
      <CustomButton
        onClick={() => setIsModalOpen(true)}
        title="Create Event"
        variant="secondary"
      >
        Create Event
      </CustomButton>

      <div className="sidebar-header">
        <h3>Calendars</h3>
        <div className="sidebar-actions">
          <IconButton
            onClick={() => setIsInviteModalOpen(true)}
            title="Create invitation"
            variant="primary"
          >
            <Mail size={16} />
          </IconButton>
          <IconButton
            onClick={() => setIsCalendarModalOpen(true)}
            title="Add calendar"
            variant="primary"
          >
            <Plus size={16} />
          </IconButton>
        </div>
      </div>

      <ul className="calendar-list">
        {Object.entries(categories).map(([key, category]) => (
          <CalendarListItem
            key={key}
            calendarKey={key}
            category={category}
            onToggle={onToggleCategory}
            onEditToggle={handleEditCalendar}
          />
        ))}
      </ul>

      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        onSubmit={handleCreateCalendar}
        isSubmitting={isCreatingCalendar}
      />

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={handleCloseInviteModal}
        onSubmit={handleCreateInvite}
        isSubmitting={isCreatingInvite}
        categories={categories}
        inviteLink={inviteLink}
      />
    </aside>
  );
};

export default CalendarSidebar;
