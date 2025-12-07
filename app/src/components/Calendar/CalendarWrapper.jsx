import { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import rrulePlugin from '@fullcalendar/rrule';
import Checkbox from '@/shared/Checkbox';
import EventModal from './EventModal';
import EventDetailsModal from './EventDetailsModal';
import {
  useToggleTask,
  useUpdateEvent,
  useDeleteEvent,
} from '@/hooks/useEvents';
import './Calendar.css';

const CalendarWrapper = ({
  eventSource,
  categories,
  onCreateEvent,
  isCreatingEvent,
  isModalOpen,
  setIsModalOpen,
  onEventEditRequest,
}) => {
  const calendarRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const toggleTaskMutation = useToggleTask();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().refetchEvents();
    }
  }, [categories]);

  const checkEventPermission = event => {
    if (!event) return false;

    const calData = event.extendedProps?.calendar;
    const calId = calData?._id || calData?.id || calData;

    const role = categories[calId]?.role;

    return role === 'owner' || role === 'editor';
  };

  const handlePointerDown = e => {
    e.stopPropagation();
  };

  const handleTaskToggleAction = (e, eventId) => {
    e.stopPropagation();
    toggleTaskMutation.mutate(eventId);
  };

  const handleEventClick = clickInfo => {
    clickInfo.jsEvent.preventDefault();
    setSelectedEvent(clickInfo.event);
    setIsDetailsOpen(true);
  };

  const handleEditClick = event => {
    setIsDetailsOpen(false);
    onEventEditRequest(event);
  };

  const handleDeleteEvent = eventId => {
    deleteEventMutation.mutate(eventId);
    setIsDetailsOpen(false);
  };

  const handleEventDrop = info => {
    if (!checkEventPermission(info.event)) {
      info.revert();
      return;
    }
    console.log('Event Dropped:', info.event);

    updateEventMutation.mutate({
      eventId: info.event.id,
      eventData: {
        start_date: info.event.start,
        end_date: info.event.end || info.event.start,
        allDay: info.event.allDay,
      },
    });
  };

  const handleEventResize = info => {
    if (!checkEventPermission(info.event)) {
      info.revert();
      return;
    }
    console.log('Event Resized:', info.event.title);

    updateEventMutation.mutate({
      eventId: info.event.id,
      eventData: {
        start_date: info.event.start,
        end_date: info.event.end,
      },
    });
  };

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

  const handleCloseCreateModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedRange(null);
  };

  const renderEventContent = eventInfo => {
    const { event } = eventInfo;
    const isTask = event.extendedProps.type === 'task';

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
        style={{ cursor: 'pointer', height: '100%' }}
        onMouseDown={e => e.preventDefault()}
      >
        <div
          className="task-checkbox-area"
          onPointerDown={handlePointerDown}
          onMouseDown={handlePointerDown}
          onClick={e => e.stopPropagation()}
        >
          <Checkbox
            checked={!!event.extendedProps.done}
            onChange={e => handleTaskToggleAction(e, event.id)}
            className="task-checkbox"
            disabled={false}
          />
        </div>
        <div
          className="fc-event-title"
          style={{
            textDecoration: event.extendedProps.done ? 'line-through' : 'none',
            opacity: event.extendedProps.done ? 0.7 : 1,
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {eventInfo.timeText && (
            <span style={{ marginRight: 4 }}>{eventInfo.timeText}</span>
          )}
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
        eventDurationEditable={true}
        eventStartEditable={true}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        eventClick={handleEventClick}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={1}
        dateClick={handleDateClick}
        select={handleSelect}
        height="100%"
        dragScroll={true}
        snapDuration="00:15:00"
        eventOverlap={true}
        eventContent={renderEventContent}
      />

      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={onCreateEvent}
        isSubmitting={isCreatingEvent}
        initialData={{
          date: selectedDate,
          endDate: selectedRange?.endDate || selectedDate,
          startTime: selectedRange?.startTime,
          endTime: selectedRange?.endTime,
        }}
        categories={categories}
      />

      <EventDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        event={selectedEvent}
        canEdit={checkEventPermission(selectedEvent)}
        onEdit={handleEditClick}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
};

export default CalendarWrapper;
