import { useState } from 'react';
import CustomInput from '@/shared/CustomInput';
import CustomTextarea from '@/shared/CustomTextarea';
import CustomButton from '@/shared/CustomButton';
import { X, Plus, Search, ChevronDown, ChevronUp } from 'lucide-react';

const CalendarEditForm = ({  
  calendarName,
  calendarDescription,
  calendarColor,
  calendarEditors,
  onNameChange,
  onDescriptionChange,
  onColorChange,
  onEditorsChange,
  onSave,
  onCancel,
  isCreating,
  onDelete,
}) => {
  const [isCollaboratorsExpanded, setIsCollaboratorsExpanded] = useState(false);

  const handleRemoveEditor = (editorId) => {
    onEditorsChange(calendarEditors.filter(e => e.id !== editorId));
  };

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

      <div className="collaborators-management">
        <button
          type="button"
          className="collaborators-toggle"
          onClick={() => setIsCollaboratorsExpanded(!isCollaboratorsExpanded)}
        >
          <span className="collaborators-label">
            Collaborators ({calendarEditors.length})
          </span>
          {isCollaboratorsExpanded ? (
            <ChevronUp size={18} color="#111827"/>
          ) : (
            <ChevronDown size={18} color="#111827"/>
          )}
        </button>
        
        {isCollaboratorsExpanded && (
          <div className="collaborators-content">
            <div className="current-editors">
              {calendarEditors.length === 0 ? (
                <p className="no-editors-text">No collaborators yet</p>
              ) : (
                calendarEditors.map((editor) => (
                  <div key={editor.id} className="editor-item">
                    <span className="editor-login">{editor.login}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEditor(editor.id)}
                      className="remove-editor-btn"
                      title="Remove editor"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

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
      <CustomButton onClick={onDelete} variant="danger">Delete Calendar</CustomButton>
    </div>
  );
};

export default CalendarEditForm;