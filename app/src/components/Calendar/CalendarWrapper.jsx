import { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import rrulePlugin from '@fullcalendar/rrule';
import Checkbox from '@/shared/Checkbox';
import EventModal from './EventModal';
import './Calendar.css';

const CalendarWrapper = ({
  eventSource,
  categories,
  onCreateEvent,
  isCreatingEvent,
  isModalOpen,
  setIsModalOpen,
}) => {
  const calendarRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().refetchEvents();
      console.log(eventSource)
    }
  }, [categories]);

  const handleDateClick = dateInfo => {
    setSelectedDate(dateInfo.dateStr);
    setSelectedRange(null);
    setIsModalOpen(true);
  };

  const handleSelect = selectInfo => {
    const { start, end, allDay, startStr, endStr } = selectInfo;

    const startDate = startStr.split('T')[0];

    if (allDay) {
      const endDateObj = new Date(endStr);
      endDateObj.setDate(endDateObj.getDate() - 1);

      const year = endDateObj.getFullYear();
      const month = String(endDateObj.getMonth() + 1).padStart(2, '0');
      const day = String(endDateObj.getDate()).padStart(2, '0');
      const endDateFormatted = `${year}-${month}-${day}`;

      setSelectedDate(startDate);
      setSelectedRange({
        endDate: endDateFormatted !== startDate ? endDateFormatted : null,
        allDay: true,
      });
    } else {
      const startTime = start.toTimeString().slice(0, 5);
      const endTime = end.toTimeString().slice(0, 5);
      const endDate = endStr.split('T')[0];

      setSelectedDate(startDate);
      setSelectedRange({
        endDate: endDate,
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

    console.log(eventSource)

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
    <div className="calendar-container">
      <FullCalendar
        ref={calendarRef}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          listPlugin,
          rrulePlugin,
        ]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        }}
        events={eventSource}
        lazyFetching={true}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        dateClick={handleDateClick}
        select={handleSelect}
        height="100%"
        eventDurationEditable={true}
        eventStartEditable={true}
        dragScroll={true}
        snapDuration="00:15:00"
        eventOverlap={true}
        eventContent={renderEventContent}
      />
      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateEvent}
        isSubmitting={isCreatingEvent}
        initialData={{
          date: selectedDate,
          endDate: selectedRange?.endDate || selectedDate,
          startTime: selectedRange?.startTime,
          endTime: selectedRange?.endTime,
        }}
        categories={categories}
      />
    </div>
  );
};

export default CalendarWrapper;
