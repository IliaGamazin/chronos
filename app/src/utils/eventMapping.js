export const backendToFullCalendar = (backendEvent, categories) => {
  const category = categories[backendEvent.calendar];

  const baseEvent = {
    id: backendEvent.id,
    title: backendEvent.title,
    backgroundColor: category?.color || '#3b82f6',
    borderColor: category?.borderColor || '#2563eb',
    display: 'block',
    extendedProps: {
      calendar: backendEvent.calendar,
      type: backendEvent.type === 'task' ? 'task' : 'event',
      completed: backendEvent.completed || false,
    },
  };

  if (backendEvent.type === 'fullday' || backendEvent.type === 'task') {
    if (backendEvent.end_date && backendEvent.end_date !== backendEvent.start_date) {
      return {
        ...baseEvent,
        start: backendEvent.start_date,
        end: backendEvent.end_date,
        allDay: true,
      };
    }

    return {
      ...baseEvent,
      date: backendEvent.start_date,
      allDay: true,
    };
  }

  return {
    ...baseEvent,
    start: backendEvent.start_time,
    end: backendEvent.end_time,
  };
};

export const fullCalendarToBackend = fcEvent => {
  const isTask = fcEvent.extendedProps?.type === 'task';
  const isAllDay = fcEvent.allDay;

  let backendType = 'arrangement';
  if (isTask) {
    backendType = 'task';
  } else if (isAllDay) {
    backendType = 'fullday';
  }

  const backendEvent = {
    title: fcEvent.title,
    calendar: fcEvent.extendedProps?.calendar || 'work',
    type: backendType,
  };

  if (isAllDay) {
    if (fcEvent.start && fcEvent.end) {
      backendEvent.start_date = fcEvent.start.toISOString().split('T')[0];
      const endDate = new Date(fcEvent.end);
      endDate.setDate(endDate.getDate() - 1);
      backendEvent.end_date = endDate.toISOString().split('T')[0];
    } else {
      const dateStr = fcEvent.date || fcEvent.start;
      backendEvent.start_date = typeof dateStr === 'string'
        ? dateStr.split('T')[0]
        : dateStr.toISOString().split('T')[0];
      backendEvent.end_date = backendEvent.start_date;
    }
  } else {
    backendEvent.start_time = fcEvent.start.toISOString();
    backendEvent.end_time = fcEvent.end.toISOString();
  }

  if (isTask) {
    backendEvent.completed = fcEvent.extendedProps?.completed || false;
  }

  return backendEvent;
};