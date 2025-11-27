import CustomInput from '@/shared/CustomInput';
import CustomTextarea from '@/shared/CustomTextarea';
import CustomButton from '@/shared/CustomButton';

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
      <CustomInput
        type="text"
        name="calendar-name"
        placeholder="Calendar name"
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
        <CustomButton
          onClick={onSave}
          disabled={isCreating || !calendarName.trim()}
          variant="primary"
        >
          {isCreating ? 'Saving...' : 'Save'}
        </CustomButton>
        <CustomButton onClick={onCancel} disabled={isCreating} variant="secondary">
          Cancel
        </CustomButton>
      </div>
    </div>
  );
};

export default CalendarForm;
