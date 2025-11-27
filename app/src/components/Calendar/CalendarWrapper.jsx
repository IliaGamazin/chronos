import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import Checkbox from '@/shared/Checkbox';
import CalendarSidebar from './CalendarSidebar';
import EventModal from './EventModal';
import './Calendar.css';

const CalendarWrapper = ({
  events,
  categories,
  onToggleCategory,
  onCreateEvent,
  isCreatingEvent,
  onCreateCalendar,
  isCreatingCalendar,
  onCreateInvite,
  isCreatingInvite,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);

  const handleDateClick = dateInfo => {
    setSelectedDate(dateInfo.dateStr);
    setSelectedRange(null);
    setIsModalOpen(true);
  };

  const handleSelect = selectInfo => {
    const start = selectInfo.start;
    const end = selectInfo.end;

    const startDate = start.toISOString().split('T')[0];

    if (selectInfo.allDay) {
      const endDate = new Date(end);
      endDate.setDate(endDate.getDate() - 1);
      const endDateStr = endDate.toISOString().split('T')[0];

      setSelectedDate(startDate);
      setSelectedRange({
        endDate: endDateStr !== startDate ? endDateStr : null,
        allDay: true,
      });
    } else {
      const startTime = start.toTimeString().slice(0, 5);
      const endTime = end.toTimeString().slice(0, 5);

      setSelectedDate(startDate);
      setSelectedRange({
        startTime,
        endTime,
        allDay: false,
      });
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedRange(null);
  };

  const handleCreateEvent = eventData => {
    onCreateEvent(eventData);
  };

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
      <CalendarSidebar
        categories={categories}
        onToggleCategory={onToggleCategory}
        onCreateCalendar={onCreateCalendar}
        isCreatingCalendar={isCreatingCalendar}
        onCreateInvite={onCreateInvite}
        isCreatingInvite={isCreatingInvite}
      />
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
          dateClick={handleDateClick}
          select={handleSelect}
          height="auto"
          eventDurationEditable={true}
          eventStartEditable={true}
          dragScroll={true}
          snapDuration="00:15:00"
          eventOverlap={true}
          eventContent={renderEventContent}
        />
      </div>
      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateEvent}
        isSubmitting={isCreatingEvent}
        initialData={{
          date: selectedDate,
          startTime: selectedRange?.startTime,
          endTime: selectedRange?.endTime,
          endDate: selectedRange?.endDate,
        }}
        categories={categories}
      />
    </div>
  );
};

export default CalendarWrapper;
