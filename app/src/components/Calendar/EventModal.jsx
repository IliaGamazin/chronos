import { useState, useEffect } from 'react';
import Modal from '@/shared/Modal';
import CustomInput from '@/shared/CustomInput';
import CustomSelect from '@/shared/CustomSelect';
import CustomButton from '@/shared/CustomButton';
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
    calendar:
      initialData.calendar || (categories && Object.keys(categories)[0]) || '',
    type: initialData.type || 'arrangement',
    date: initialData.date || '',
    startTime: initialData.startTime || '',
    endTime: initialData.endTime || '',
    endDate: initialData.endDate || '',
  });

  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState({
    freq: 'DAILY',
    interval: 1,
    endType: 'never',
    until: '',
    count: null,
  });

  useEffect(() => {
    if (isOpen) {
      const hasEndDate =
        initialData.endDate && initialData.endDate !== initialData.date;
      const hasTimeRange = initialData.startTime && initialData.endTime;

      let defaultType = 'arrangement';
      if (hasEndDate) {
        defaultType = 'fullday';
      } else if (!hasTimeRange && initialData.date) {
        defaultType = 'arrangement';
      }

      setFormData({
        title: initialData.title || '',
        calendar:
          initialData.calendar ||
          (categories && Object.keys(categories)[0]) ||
          '',
        type: initialData.type || defaultType,
        date: initialData.date || '',
        startTime: initialData.startTime || '',
        endTime: initialData.endTime || '',
        endDate: initialData.endDate || '',
      });

      setIsRecurring(false);
      setRecurrence({
        freq: 'DAILY',
        interval: 1,
        endType: 'never',
        until: '',
        count: null,
      });
    }
  }, [isOpen, initialData, categories]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const eventData = {
      name: formData.title,
      calendar_id: formData.calendar,
      type: formData.type,
    };

    if (formData.type === 'arrangement') {
      const startDateTime = `${formData.date}T${formData.startTime}:00`;
      const endDateTime = `${formData.date}T${formData.endTime}:00`;

      eventData.start_date = new Date(startDateTime).toISOString();
      eventData.end_date = new Date(endDateTime).toISOString();
    } else {
      const startDateObj = new Date(formData.date);

      let endDateObj = formData.endDate
        ? new Date(formData.endDate)
        : new Date(formData.date);

      if (endDateObj <= startDateObj) {
        endDateObj.setDate(startDateObj.getDate() + 1);
      }

      eventData.start_date = startDateObj.toISOString();
      eventData.end_date = endDateObj.toISOString();
    }

    if (isRecurring) {
      eventData.recurrence = {
        freq: recurrence.freq,
        interval: recurrence.interval,
      };

      if (recurrence.endType === 'until' && recurrence.until) {
        eventData.recurrence.until = new Date(recurrence.until).toISOString();
      } else if (recurrence.endType === 'count' && recurrence.count) {
        eventData.recurrence.count = recurrence.count;
      }
    }

    if (formData.type === 'task') {
      eventData.completed = false;
    }

    onSubmit(eventData);

    setFormData({
      title: '',
      calendar: (categories && Object.keys(categories)[0]) || '',
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
          {categories &&
            Object.entries(categories).map(([key, category]) => (
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

        {isAllDayEvent && (
          <CustomInput
            type="date"
            name="endDate"
            label="End Date (Optional)"
            value={formData.endDate}
            onChange={handleChange}
            placeholder="Leave empty for 1 day"
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

        <div className="recurring-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={e => setIsRecurring(e.target.checked)}
            />
            <span>Recurring Event</span>
          </label>
        </div>

        {isRecurring && (
          <div className="recurrence-options">
            <div className="recurrence-row">
              <CustomSelect
                id="freq"
                name="freq"
                label="Frequency"
                value={recurrence.freq}
                onChange={e =>
                  setRecurrence(prev => ({ ...prev, freq: e.target.value }))
                }
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </CustomSelect>

              <CustomInput
                type="number"
                name="interval"
                label="Repeat Every"
                value={recurrence.interval}
                onChange={e =>
                  setRecurrence(prev => ({
                    ...prev,
                    interval: parseInt(e.target.value) || 1,
                  }))
                }
                min="1"
                placeholder="1"
              />
            </div>

            <div className="end-condition-section">
              <label className="section-label">Ends</label>

              <label className="radio-label">
                <input
                  type="radio"
                  name="endType"
                  value="never"
                  checked={recurrence.endType === 'never'}
                  onChange={e =>
                    setRecurrence(prev => ({
                      ...prev,
                      endType: e.target.value,
                    }))
                  }
                />
                <span>Never</span>
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  name="endType"
                  value="until"
                  checked={recurrence.endType === 'until'}
                  onChange={e =>
                    setRecurrence(prev => ({
                      ...prev,
                      endType: e.target.value,
                    }))
                  }
                />
                <span>On date</span>
              </label>
              {recurrence.endType === 'until' && (
                <CustomInput
                  type="date"
                  name="until"
                  label=""
                  value={recurrence.until}
                  onChange={e =>
                    setRecurrence(prev => ({ ...prev, until: e.target.value }))
                  }
                />
              )}

              <label className="radio-label">
                <input
                  type="radio"
                  name="endType"
                  value="count"
                  checked={recurrence.endType === 'count'}
                  onChange={e =>
                    setRecurrence(prev => ({
                      ...prev,
                      endType: e.target.value,
                    }))
                  }
                />
                <span>After</span>
              </label>
              {recurrence.endType === 'count' && (
                <CustomInput
                  type="number"
                  name="count"
                  label=""
                  value={recurrence.count || ''}
                  onChange={e =>
                    setRecurrence(prev => ({
                      ...prev,
                      count: parseInt(e.target.value) || null,
                    }))
                  }
                  min="1"
                  placeholder="Number of occurrences"
                />
              )}
            </div>
          </div>
        )}

        <div className="form-actions">
          <CustomButton
            type="button"
            onClick={onClose}
            variant="secondary"
            disabled={isSubmitting}
          >
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </CustomButton>
        </div>
      </form>
    </Modal>
  );
};

export default EventModal;
