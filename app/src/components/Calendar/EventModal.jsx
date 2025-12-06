import { useState, useEffect } from 'react';
import { DatePicker, TimePicker } from 'antd';
import dayjs from 'dayjs';
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
    endDate: initialData.endDate || initialData.date || '',
    startTime: initialData.startTime || '',
    endTime: initialData.endTime || '',
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
      if (hasEndDate || hasTimeRange) {
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
        endDate: initialData.endDate || initialData.date || '',
        startTime: initialData.startTime || '',
        endTime: initialData.endTime || '',
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

    if (formData.type === 'task' || formData.type === 'fullday') {
      eventData.start_date = formData.date;
      eventData.end_date = formData.date;
    } else if (formData.type === 'arrangement') {
      const isISOWithTime = formData.date.includes('T') && formData.date.length > 10;
      let startDateTime, endDateTime;

      if (isISOWithTime) {
          startDateTime = formData.date.split('T')[0] + 'T' + formData.startTime + ':00';
          endDateTime = formData.endDate.split('T')[0] + 'T' + formData.endTime + ':00';
      } else {
          startDateTime = `${formData.date}T${formData.startTime}:00`;
          endDateTime = `${formData.endDate}T${formData.endTime}:00`;
      }

      const startDateObj = new Date(startDateTime);
      const endDateObj = new Date(endDateTime);
      console.log(startDateObj, endDateObj)
      const now = new Date();
      now.setSeconds(0, 0);

      if (startDateObj < now) {
        alert('Cannot create events with start date/time in the past');
        return;
      }

      if (endDateObj <= startDateObj) {
        alert('End date/time must be after start date/time');
        return;
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
      endDate: '',
      startTime: '',
      endTime: '',
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

        {(formData.type === 'fullday' || formData.type === 'task') && (
          <div className="form-group">
            <label>Date</label>
            <DatePicker
              value={formData.date ? dayjs(formData.date) : null}
              onChange={date => {
                const dateStr = date ? date.format('YYYY-MM-DD') : '';
                setFormData(prev => ({
                  ...prev,
                  date: dateStr,
                  endDate: dateStr,
                }));
              }}
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
            />
          </div>
        )}

        {formData.type === 'arrangement' && (
          <>
            <div className="row-inputs">
              <div className="form-group">
                <label>Start Date</label>
                <DatePicker
                  value={formData.date ? dayjs(formData.date) : null}
                  onChange={date => {
                    const dateStr = date ? date.format('YYYY-MM-DD') : '';
                    setFormData(prev => ({ ...prev, date: dateStr }));
                  }}
                  format="YYYY-MM-DD"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <DatePicker
                  value={formData.endDate ? dayjs(formData.endDate) : null}
                  onChange={date => {
                    const dateStr = date ? date.format('YYYY-MM-DD') : '';
                    setFormData(prev => ({ ...prev, endDate: dateStr }));
                  }}
                  minDate={formData.date ? dayjs(formData.date) : null}
                  format="YYYY-MM-DD"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div className="row-inputs">
              <div className="form-group">
                <label>Start Time</label>
                <TimePicker
                  value={
                    formData.startTime
                      ? dayjs(`2000-01-01 ${formData.startTime}`)
                      : null
                  }
                  onChange={time => {
                    const timeStr = time ? time.format('HH:mm') : '';
                    setFormData(prev => ({ ...prev, startTime: timeStr }));
                  }}
                  format="HH:mm"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label>End Time</label>
                <TimePicker
                  value={
                    formData.endTime
                      ? dayjs(`2000-01-01 ${formData.endTime}`)
                      : null
                  }
                  onChange={time => {
                    const timeStr = time ? time.format('HH:mm') : '';
                    setFormData(prev => ({ ...prev, endTime: timeStr }));
                  }}
                  format="HH:mm"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
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
