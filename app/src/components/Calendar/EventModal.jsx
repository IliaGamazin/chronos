import { useState, useEffect } from 'react';
import Modal from '@/shared/Modal';
import CustomInput from '@/shared/CustomInput';
import CustomSelect from '@/shared/CustomSelect';
import './EventModal.css';

const EventModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  initialData = {},
  categories,
}) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    calendar: initialData.calendar || 'work',
    type: initialData.type || 'arrangement',
    date: initialData.date || '',
    startTime: initialData.startTime || '',
    endTime: initialData.endTime || '',
    endDate: initialData.endDate || '',
  });

  useEffect(() => {
    if (isOpen) {
      const hasEndDate = initialData.endDate && initialData.endDate !== initialData.date;
      const hasTimeRange = initialData.startTime && initialData.endTime;

      let defaultType = 'arrangement';
      if (hasEndDate) {
        defaultType = 'fullday';
      } else if (!hasTimeRange && initialData.date) {
        defaultType = 'arrangement';
      }

      setFormData({
        title: initialData.title || '',
        calendar: initialData.calendar || 'work',
        type: initialData.type || defaultType,
        date: initialData.date || '',
        startTime: initialData.startTime || '',
        endTime: initialData.endTime || '',
        endDate: initialData.endDate || '',
      });
    }
  }, [isOpen, initialData.date, initialData.endDate, initialData.startTime, initialData.endTime]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const eventData = {
      title: formData.title,
      calendar: formData.calendar,
      type: formData.type,
    };

    if (formData.type === 'arrangement') {
      const startDateTime = `${formData.date}T${formData.startTime}:00`;
      const endDateTime = `${formData.date}T${formData.endTime}:00`;
      eventData.start_time = new Date(startDateTime).toISOString();
      eventData.end_time = new Date(endDateTime).toISOString();
    } else {
      eventData.start_date = formData.date;
      eventData.end_date = formData.endDate || formData.date;
    }

    if (formData.type === 'task') {
      eventData.completed = false;
    }

    onSubmit(eventData);
    setFormData({
      title: '',
      calendar: 'work',
      type: 'arrangement',
      date: '',
      startTime: '',
      endTime: '',
      endDate: '',
    });
    onClose();
  };

  const isTimedEvent = formData.type === 'arrangement';
  const isAllDayEvent = formData.type === 'fullday' || formData.type === 'task';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Event">
      <form onSubmit={handleSubmit} className="event-form">
        <CustomInput
          type="text"
          name="title"
          label="Title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Event title"
          required
        />

        <CustomSelect
          id="type"
          name="type"
          label="Type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="arrangement">Timed Event</option>
          <option value="fullday">All-Day Event</option>
          <option value="task">Task</option>
        </CustomSelect>

        <CustomSelect
          id="calendar"
          name="calendar"
          label="Calendar"
          value={formData.calendar}
          onChange={handleChange}
          required
        >
          {Object.entries(categories).map(([key, category]) => (
            <option key={key} value={key}>
              {category.name}
            </option>
          ))}
        </CustomSelect>

        <CustomInput
          type="date"
          name="date"
          label="Date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        {isAllDayEvent && formData.endDate && (
          <CustomInput
            type="date"
            name="endDate"
            label="End Date"
            value={formData.endDate}
            onChange={handleChange}
          />
        )}

        {isTimedEvent && (
          <>
            <CustomInput
              type="time"
              name="startTime"
              label="Start Time"
              value={formData.startTime}
              onChange={handleChange}
              required
            />

            <CustomInput
              type="time"
              name="endTime"
              label="End Time"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={onClose}
            className="button-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type="submit" className="button-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EventModal;