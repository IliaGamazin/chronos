import { useState } from 'react';
import { Plus, Mail } from 'lucide-react';
import IconButton from '@/shared/IconButton';
import CalendarForm from './CalendarForm';
import CalendarListItem from './CalendarListItem';
import InviteModal from './InviteModal';
import CalendarEditForm from './CalendarEditForm';

const CalendarSidebar = ({
  categories,
  onToggleCategory,
  onCreateCalendar,
  isCreatingCalendar,
  onCreateInvite,
  isCreatingInvite,
}) => {
  const [isAddingCalendar, setIsAddingCalendar] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [newCalendarName, setNewCalendarName] = useState('');
  const [newCalendarDescription, setNewCalendarDescription] = useState('');
  const [newCalendarColor, setNewCalendarColor] = useState('#3b82f6');
  const [editedCalendar, setEditedCalendar] = useState(null);
  const [calendarEditors, setCalendarEditors] = useState([]);

  const handleSaveCalendar = () => {
    if (!newCalendarName.trim()) return;

    onCreateCalendar({
      name: newCalendarName,
      description: newCalendarDescription,
      color: newCalendarColor,
      timezone: 'UTC',
    });

    setNewCalendarName('');
    setNewCalendarDescription('');
    setNewCalendarColor('#3b82f6');
    setCalendarEditors([]);
    setIsAddingCalendar(false);
  };

  const handleCancelCalendar = () => {
    setIsAddingCalendar(false);
    setEditedCalendar(null);
    setNewCalendarName('');
    setNewCalendarDescription('');
    setNewCalendarColor('#3b82f6');
    setCalendarEditors([]);
  };

  const handleCreateInvite = inviteData => {
    onCreateInvite(inviteData)
      .then(response => {
        const token = response?.data || response?.data?.data;

        if (token && typeof token === 'string') {
          const link = `${window.location.origin}/invite/${token}`;
          setInviteLink(link);
        }
      })
      .catch(error => {
        console.error('Failed to create invite:', error);
      });
  };

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
    setInviteLink('');
  };

  const handleEditCalendar = (calendar) => {
    if(isAddingCalendar) {
      setIsAddingCalendar(!isAddingCalendar);
    }
    setEditedCalendar(calendar);
    setNewCalendarName(calendar.name)
    setNewCalendarDescription(calendar.description);
    setNewCalendarColor(calendar.color);
    setCalendarEditors(calendar.editors);
  } 

  const handleUpdateCalendar = () => {
    //
    handleCancelCalendar();
  }

  const handleCreateCalendar = () => {
    setNewCalendarName('');
    setNewCalendarDescription('');
    setNewCalendarColor('#3b82f6');
    setCalendarEditors([]);
    
    setIsAddingCalendar(!isAddingCalendar)
    if(editedCalendar) {
      setEditedCalendar(null);
    }
  }

  return (
    <aside className="calendar-sidebar">
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
            onClick={() => handleCreateCalendar()}
            title="Add calendar"
            variant="primary"
          >
            <Plus size={16} />
          </IconButton>
        </div>
      </div>
      {isAddingCalendar && (
        <CalendarForm
          calendarName={newCalendarName}
          calendarDescription={newCalendarDescription}
          calendarColor={newCalendarColor}
          onNameChange={e => setNewCalendarName(e.target.value)}
          onDescriptionChange={e => setNewCalendarDescription(e.target.value)}
          onColorChange={e => setNewCalendarColor(e.target.value)}
          onSave={handleSaveCalendar}
          onCancel={handleCancelCalendar}
          isCreating={isCreatingCalendar}
        />
      )}
      {editedCalendar && (
        <CalendarEditForm
          calendarName={newCalendarName}
          calendarDescription={newCalendarDescription}
          calendarColor={newCalendarColor}
          calendarEditors={calendarEditors}
          onNameChange={e => setNewCalendarName(e.target.value)}
          onDescriptionChange={e => setNewCalendarDescription(e.target.value)}
          onColorChange={e => setNewCalendarColor(e.target.value)}
          onEditorsChange={setCalendarEditors}
          onSave={handleUpdateCalendar}
          onCancel={handleCancelCalendar}
          isCreating={isCreatingCalendar}
        />
      )}
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
