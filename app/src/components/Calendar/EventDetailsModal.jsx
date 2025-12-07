import {
  X,
  Pencil,
  Clock,
  AlignLeft,
  Calendar as CalendarIcon,
  CheckSquare,
} from 'lucide-react';
import IconButton from '@/shared/IconButton';
import './EventDetailsModal.css';

const EventDetailsModal = ({
  isOpen,
  onClose,
  event,
  onEdit,
  onDelete,
  canEdit,
}) => {
  if (!isOpen || !event) return null;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete(event.id);
      onClose();
    }
  };

  const formatDateRange = (start, end) => {
    if (!start) return '';
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };

    const dateStr = start.toLocaleDateString('en-US', dateOptions);
    const startTime = start.toLocaleTimeString('en-US', timeOptions);
    const endTime = end ? end.toLocaleTimeString('en-US', timeOptions) : '';

    if (event.allDay) return dateStr;
    return `${dateStr} · ${startTime} ${end ? `- ${endTime}` : ''}`;
  };

  return (
    <div className="event-details-overlay" onClick={onClose}>
      <div className="event-details-card" onClick={e => e.stopPropagation()}>
        <div className="event-details-header">
          <div
            className="header-actions"
            style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}
          >
            {canEdit && (
              <IconButton onClick={() => onEdit(event)} title="Edit event">
                <Pencil size={18} />
              </IconButton>
            )}
            <IconButton onClick={onClose} title="Close">
              <X size={20} />
            </IconButton>
          </div>
        </div>

        <div className="event-details-content">
          <div className="detail-row header-row">
            <div
              className="color-square"
              style={{
                backgroundColor:
                  event.backgroundColor || event.borderColor || '#3b82f6',
              }}
            ></div>
            <h2 className={event.extendedProps?.done ? 'task-done' : ''}>
              {event.title}
            </h2>
          </div>

          <div className="detail-row">
            <Clock size={18} className="detail-icon" />
            <div className="detail-text">
              {formatDateRange(event.start, event.end)}
            </div>
          </div>

          {event.extendedProps?.description && (
            <div className="detail-row">
              <AlignLeft size={18} className="detail-icon" />
              <div className="detail-text description">
                {event.extendedProps.description}
              </div>
            </div>
          )}

          <div className="detail-row">
            <CalendarIcon size={18} className="detail-icon" />
            <div className="detail-text">
              {event.extendedProps?.calendar?.name || 'My Calendar'}
            </div>
          </div>

          {event.extendedProps?.type === 'task' && (
            <div className="detail-row">
              <CheckSquare size={18} className="detail-icon" />
              <div className="detail-text">
                Status: {event.extendedProps.done ? 'Completed' : 'Pending'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
