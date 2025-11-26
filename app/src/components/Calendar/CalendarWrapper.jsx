import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import Checkbox from '@/shared/Checkbox';
import './Calendar.css';

const CalendarWrapper = ({ events, categories, onToggleCategory }) => {
  const handleEventClick = () => {};

  const handleDateClick = () => {};

  const renderEventContent = eventInfo => {
    const { event } = eventInfo;
    const isTask = event.extendedProps.type === 'task';
    const isCompleted = event.extendedProps.completed;

    if (!isTask) {
      return (
        <div className="fc-event-content">
          <div className="fc-event-time">{eventInfo.timeText}</div>
          <div className="fc-event-title">{event.title}</div>
        </div>
      );
    }

    return (
      <div
        className="fc-task-content"
        onClick={e => {
          e.stopPropagation();
          const currentCompleted = event.extendedProps.completed;
          event.setExtendedProp('completed', !currentCompleted);
        }}
      >
        <Checkbox
          checked={isCompleted}
          onChange={() => {}}
          className="task-checkbox"
        />
        <div className="fc-event-time">{eventInfo.timeText}</div>
        <div
          className="fc-event-title"
          style={{
            textDecoration: isCompleted ? 'line-through' : 'none',
            opacity: isCompleted ? 0.7 : 1,
          }}
        >
          {event.title}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-wrapper">
      <aside className="calendar-sidebar">
        <h3>Calendars</h3>
        <ul className="calendar-list">
          {Object.entries(categories).map(([key, category]) => (
            <li key={key} className="calendar-item">
              <label className="calendar-toggle">
                <Checkbox
                  checked={category.visible}
                  onChange={() => onToggleCategory(key)}
                  variant="primary"
                />
                <span
                  className="calendar-color"
                  style={{ backgroundColor: category.color }}
                />
                <span className="calendar-name">{category.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </aside>
      <div className="calendar-container">
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
          ]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
          }}
          events={events}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          height="auto"
          eventDurationEditable={true}
          eventStartEditable={true}
          dragScroll={true}
          snapDuration="00:15:00"
          eventOverlap={true}
          eventContent={renderEventContent}
        />
      </div>
    </div>
  );
};

export default CalendarWrapper;
