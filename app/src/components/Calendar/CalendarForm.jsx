import CustomTextarea from '@/shared/CustomTextarea';

const CalendarForm = ({
  calendarName,
  calendarDescription,
  calendarColor,
  onNameChange,
  onDescriptionChange,
  onColorChange,
  onSave,
  onCancel,
  isCreating,
}) => {
  return (
    <div className="add-calendar-form">
      <input
        type="text"
        placeholder="Calendar name"
        className="calendar-name-input"
        value={calendarName}
        onChange={onNameChange}
      />
      <CustomTextarea
        name="description"
        placeholder="Description (optional)"
        value={calendarDescription}
        onChange={onDescriptionChange}
        rows={2}
      />
      <input
        type="color"
        value={calendarColor}
        onChange={onColorChange}
        className="calendar-color-input"
      />
      <div className="form-actions-inline">
        <button
          className="btn-save"
          onClick={onSave}
          disabled={isCreating || !calendarName.trim()}
        >
          {isCreating ? 'Saving...' : 'Save'}
        </button>
        <button className="btn-cancel" onClick={onCancel} disabled={isCreating}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CalendarForm;
