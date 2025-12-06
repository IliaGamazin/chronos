import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckSquare } from 'lucide-react';
import { DatePicker, TimePicker } from 'antd';
import dayjs from 'dayjs';
import CustomInput from '@/shared/CustomInput';
import CustomTextarea from '@/shared/CustomTextarea';
import CustomSelect from '@/shared/CustomSelect';
import CustomButton from '@/shared/CustomButton';
import IconButton from '@/shared/IconButton';
import './CalendarSettings.css';

const EventSettings = ({
  event,
  onBack,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
  canEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: '#3b82f6',
    type: 'arrangement',
    date: '',
    endDate: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    if (event) {
      const start = event.start ? new Date(event.start) : new Date();
      const end = event.end ? new Date(event.end) : new Date(start);
      const isAllDay = event.allDay;
      const type =
        event.extendedProps?.type || (isAllDay ? 'fullday' : 'arrangement');

      setFormData({
        title: event.title || '',
        description: event.extendedProps?.description || '',
        color: event.backgroundColor || event.borderColor || '#3b82f6',
        type: type,
        date: dayjs(start).format('YYYY-MM-DD'),
        endDate: dayjs(end).format('YYYY-MM-DD'),
        startTime: dayjs(start).format('HH:mm'),
        endTime: event.end
          ? dayjs(end).format('HH:mm')
          : dayjs(start).add(1, 'hour').format('HH:mm'),
      });
    }
  }, [event]);

  const handleSave = () => {
    const eventData = {
      name: formData.title,
      description: formData.description,
      color: formData.color,
      type: formData.type,
    };

    if (formData.type === 'task' || formData.type === 'fullday') {
      eventData.start_date = formData.date;
      eventData.end_date = formData.date;
      eventData.allDay = true;
    } else {
      const startDateTime = `${formData.date}T${formData.startTime}:00`;
      const endDateTime = `${formData.endDate}T${formData.endTime}:00`;

      const startDateObj = new Date(startDateTime);
      const endDateObj = new Date(endDateTime);

      if (endDateObj <= startDateObj) {
        alert('End date/time must be after start date/time');
        return;
      }

      eventData.start_date = startDateObj.toISOString();
      eventData.end_date = endDateObj.toISOString();
      eventData.allDay = false;
    }

    onUpdate({
      eventId: event.id,
      eventData: eventData,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      onDelete(event.id);
    }
  };

  const formatDateDisplay = date => {
    if (!date) return '';
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const startDateObj = event.start ? new Date(event.start) : null;
  const endDateObj = event.end ? new Date(event.end) : null;

  return (
    <div className="calendar-settings">
      <div className="settings-header">
        <IconButton
          onClick={onBack}
          title="Back to Calendar"
          variant="secondary"
        >
          <ArrowLeft size={20} />
        </IconButton>
        <h2>Event Details</h2>
      </div>

      <div className="settings-content">
        <section className="settings-section">
          <div className="section-header">
            <h3>Basic Information</h3>
          </div>

          <div className="settings-info">
            <div className="info-item">
              <label>Title</label>
              <p>{event.title}</p>
            </div>

            <div className="info-item">
              <label>Time</label>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Clock size={16} className="text-gray-500" />
                <p>
                  {event.allDay
                    ? startDateObj?.toLocaleDateString()
                    : `${formatDateDisplay(startDateObj)} - ${endDateObj ? endDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}`}
                </p>
              </div>
            </div>

            <div className="info-item">
              <label>Type</label>
              <p style={{ textTransform: 'capitalize' }}>
                {event.extendedProps?.type ||
                  (event.allDay ? 'All-day' : 'Timed')}
              </p>
            </div>

            {event.extendedProps?.type === 'task' && (
              <div className="info-item">
                <label>Status</label>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <CheckSquare size={16} />
                  <p>{event.extendedProps.done ? 'Completed' : 'Pending'}</p>
                </div>
              </div>
            )}

            <div className="info-item">
              <label>Description</label>
              <p style={{ whiteSpace: 'pre-wrap' }}>
                {event.extendedProps?.description || 'No description'}
              </p>
            </div>

            <div className="info-item">
              <label>Color</label>
              <div className="color-display">
                <span
                  className="color-indicator"
                  style={{ backgroundColor: formData.color }}
                />
                <span>{formData.color}</span>
              </div>
            </div>
          </div>
        </section>

        {canEdit && (
          <section className="settings-section">
            <div className="section-header">
              <h3>Edit Event</h3>
            </div>

            {isEditing ? (
              <div className="settings-form">
                <CustomInput
                  label="Title"
                  value={formData.title}
                  onChange={e =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />

                <CustomTextarea
                  label="Description"
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />

                <CustomSelect
                  label="Type"
                  value={formData.type}
                  onChange={e =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option value="arrangement">Timed Event</option>
                  <option value="fullday">All-Day Event</option>
                  <option value="task">Task</option>
                </CustomSelect>

                <div
                  className="row-inputs"
                  style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}
                >
                  <div className="form-group" style={{ flex: 1 }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      {formData.type === 'arrangement' ? 'Start Date' : 'Date'}
                    </label>
                    <DatePicker
                      value={formData.date ? dayjs(formData.date) : null}
                      onChange={date => {
                        const dateStr = date ? date.format('YYYY-MM-DD') : '';
                        setFormData(prev => ({
                          ...prev,
                          date: dateStr,
                          endDate:
                            prev.type === 'fullday' || prev.type === 'task'
                              ? dateStr
                              : prev.endDate,
                        }));
                      }}
                      format="YYYY-MM-DD"
                      style={{ width: '100%' }}
                      allowClear={false}
                    />
                  </div>

                  {formData.type === 'arrangement' && (
                    <div className="form-group" style={{ flex: 1 }}>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                        }}
                      >
                        End Date
                      </label>
                      <DatePicker
                        value={
                          formData.endDate ? dayjs(formData.endDate) : null
                        }
                        onChange={date => {
                          const dateStr = date ? date.format('YYYY-MM-DD') : '';
                          setFormData(prev => ({ ...prev, endDate: dateStr }));
                        }}
                        minDate={formData.date ? dayjs(formData.date) : null}
                        format="YYYY-MM-DD"
                        style={{ width: '100%' }}
                        allowClear={false}
                      />
                    </div>
                  )}
                </div>

                {formData.type === 'arrangement' && (
                  <div
                    className="row-inputs"
                    style={{
                      display: 'flex',
                      gap: '16px',
                      marginBottom: '16px',
                    }}
                  >
                    <div className="form-group" style={{ flex: 1 }}>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                        }}
                      >
                        Start Time
                      </label>
                      <TimePicker
                        value={
                          formData.startTime
                            ? dayjs(`2000-01-01 ${formData.startTime}`)
                            : null
                        }
                        onChange={time => {
                          const timeStr = time ? time.format('HH:mm') : '';
                          setFormData(prev => ({
                            ...prev,
                            startTime: timeStr,
                          }));
                        }}
                        format="HH:mm"
                        style={{ width: '100%' }}
                        allowClear={false}
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                        }}
                      >
                        End Time
                      </label>
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
                        allowClear={false}
                      />
                    </div>
                  </div>
                )}

                <div className="color-input-group">
                  <label>Color</label>
                  <div
                    className="color-picker-wrapper"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <input
                      type="color"
                      value={formData.color}
                      onChange={e =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      style={{
                        width: '40px',
                        height: '40px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                      }}
                    />
                    <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      {formData.color}
                    </span>
                  </div>
                </div>

                <div className="form-actions">
                  <CustomButton
                    onClick={handleSave}
                    disabled={isUpdating || !formData.title.trim()}
                    variant="primary"
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </CustomButton>
                  <CustomButton
                    onClick={handleCancel}
                    disabled={isUpdating}
                    variant="secondary"
                  >
                    Cancel
                  </CustomButton>
                </div>
              </div>
            ) : (
              <CustomButton
                onClick={() => setIsEditing(true)}
                variant="primary"
              >
                Edit Event
              </CustomButton>
            )}
          </section>
        )}

        {canEdit && (
          <section className="settings-section danger-zone">
            <h3>Danger Zone</h3>
            <div className="danger-action">
              <h4>Delete Event</h4>
              <p>
                Permanently delete this event. This action cannot be undone.
              </p>
              <CustomButton
                onClick={handleDelete}
                disabled={isDeleting}
                variant="danger"
              >
                {isDeleting ? 'Deleting...' : 'Delete Event'}
              </CustomButton>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default EventSettings;
