import { useState } from 'react';
import CalendarForm from './CalendarForm';
import CalendarListItem from './CalendarListItem';

const CalendarSidebar = ({
  categories,
  onToggleCategory,
  onCreateCalendar,
  isCreatingCalendar,
}) => {
  const [isAddingCalendar, setIsAddingCalendar] = useState(false);
  const [newCalendarName, setNewCalendarName] = useState('');
  const [newCalendarDescription, setNewCalendarDescription] = useState('');
  const [newCalendarColor, setNewCalendarColor] = useState('#3b82f6');

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
    setIsAddingCalendar(false);
  };

  const handleCancelCalendar = () => {
    setIsAddingCalendar(false);
    setNewCalendarName('');
    setNewCalendarDescription('');
    setNewCalendarColor('#3b82f6');
  };

  return (
    <aside className="calendar-sidebar">
      <div className="sidebar-header">
        <h3>Calendars</h3>
        <button
          className="add-calendar-btn"
          onClick={() => setIsAddingCalendar(!isAddingCalendar)}
          title="Add calendar"
        >
          +
        </button>
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
      <ul className="calendar-list">
        {Object.entries(categories).map(([key, category]) => (
          <CalendarListItem
            key={key}
            calendarKey={key}
            category={category}
            onToggle={onToggleCategory}
          />
        ))}
      </ul>
    </aside>
  );
};

export default CalendarSidebar;
