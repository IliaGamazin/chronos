import { useState } from 'react';
import { ArrowLeft, Trash2, UserMinus, UserPlus } from 'lucide-react';
import CustomInput from '@/shared/CustomInput';
import CustomTextarea from '@/shared/CustomTextarea';
import CustomButton from '@/shared/CustomButton';
import IconButton from '@/shared/IconButton';
import './CalendarSettings.css';

const CalendarSettings = ({
  calendar,
  onBack,
  onUpdate,
  onDelete,
  onUnfollow,
  onRemoveCollaborator,
  isUpdating,
  isDeleting,
  isUnfollowing,
  isRemovingCollaborator,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(calendar.name || '');
  const [description, setDescription] = useState(calendar.description || '');
  const [color, setColor] = useState(calendar.color || '#3b82f6');

  const isOwner = calendar.role === 'owner';
  const isEditor = calendar.role === 'editor';

  const handleSave = () => {
    onUpdate({
      calendarId: calendar.id,
      calendarData: { name, description, color },
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(calendar.name || '');
    setDescription(calendar.description || '');
    setColor(calendar.color || '#3b82f6');
    setIsEditing(false);
  };

  const handleDelete = () => {
    console.log('[Settings] Delete button clicked for calendar:', calendar.id);
    if (window.confirm(`Are you sure you want to delete "${calendar.name}"? This action cannot be undone.`)) {
      console.log('[Settings] User confirmed, calling onDelete');
      onDelete(calendar.id);
    } else {
      console.log('[Settings] User cancelled deletion');
    }
  };

  const handleUnfollow = () => {
    if (window.confirm(`Are you sure you want to unfollow "${calendar.name}"?`)) {
      onUnfollow(calendar.id);
    }
  };

  const handleRemoveCollaborator = (userId, userName) => {
    if (window.confirm(`Are you sure you want to remove ${userName} from this calendar?`)) {
      onRemoveCollaborator({ calendarId: calendar.id, userId });
    }
  };

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
        <h2>Calendar Settings</h2>
      </div>

      <div className="settings-content">
        <section className="settings-section">
          <div className="section-header">
            <h3>Basic Information</h3>
          </div>

          <div className="settings-info">
            <div className="info-item">
              <label>Name</label>
              <p>{calendar.name}</p>
            </div>
            <div className="info-item">
              <label>Description</label>
              <p>{calendar.description || 'No description'}</p>
            </div>
            <div className="info-item">
              <label>Color</label>
              <div className="color-display">
                <span
                  className="color-indicator"
                  style={{ backgroundColor: calendar.color }}
                />
                <span>{calendar.color}</span>
              </div>
            </div>
            <div className="info-item">
              <label>Your Role</label>
              <p className="role-badge">{calendar.role}</p>
            </div>
          </div>
        </section>

        {(isOwner || isEditor) && (
          <section className="settings-section">
            <div className="section-header">
              <h3>Edit Calendar</h3>
            </div>

            {isEditing ? (
              <div className="settings-form">
                <CustomInput
                  type="text"
                  name="calendar-name"
                  placeholder="Calendar name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  label="Name"
                />
                <CustomTextarea
                  name="description"
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  label="Description"
                />
                <div className="color-input-group">
                  <label>Color</label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="calendar-color-input"
                  />
                </div>
                <div className="form-actions">
                  <CustomButton
                    onClick={handleSave}
                    disabled={isUpdating || !name.trim()}
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
                Edit Calendar
              </CustomButton>
            )}
          </section>
        )}

        {(isOwner || isEditor) && (
          <section className="settings-section">
            <h3>Collaborators</h3>
            <div className="collaborators-list">
              {calendar.editors && calendar.editors.length > 0 && (
                <div className="collaborator-group">
                  <h4>Editors</h4>
                  {calendar.editors.map((editor) => (
                    <div key={editor.id} className="collaborator-item">
                      <div className="collaborator-info">
                        <span className="collaborator-name">{editor.login || editor.email}</span>
                        <span className="collaborator-email">{editor.email}</span>
                      </div>
                      {isOwner && (
                        <IconButton
                          onClick={() => handleRemoveCollaborator(editor.id, editor.login || editor.email)}
                          disabled={isRemovingCollaborator}
                          title="Remove editor"
                          variant="danger"
                        >
                          <UserMinus size={16} />
                        </IconButton>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {calendar.followers && calendar.followers.length > 0 && (
                <div className="collaborator-group">
                  <h4>Followers</h4>
                  {calendar.followers.map((follower) => (
                    <div key={follower.id} className="collaborator-item">
                      <div className="collaborator-info">
                        <span className="collaborator-name">{follower.login || follower.email}</span>
                        <span className="collaborator-email">{follower.email}</span>
                      </div>
                      {isOwner && (
                        <IconButton
                          onClick={() => handleRemoveCollaborator(follower.id, follower.login || follower.email)}
                          disabled={isRemovingCollaborator}
                          title="Remove follower"
                          variant="danger"
                        >
                          <UserMinus size={16} />
                        </IconButton>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {(!calendar.editors || calendar.editors.length === 0) &&
               (!calendar.followers || calendar.followers.length === 0) && (
                <p className="no-collaborators">No collaborators yet</p>
              )}
            </div>
          </section>
        )}

        <section className="settings-section danger-zone">
          <h3>Danger Zone</h3>
          {isOwner ? (
            <div className="danger-action">
              <h4>Delete Calendar</h4>
              <p>Permanently delete this calendar and all its events. This action cannot be undone.</p>
              <CustomButton
                onClick={handleDelete}
                disabled={isDeleting}
                variant="danger"
              >
                {isDeleting ? 'Deleting...' : 'Delete Calendar'}
              </CustomButton>
            </div>
          ) : (
            <div className="danger-action">
              <h4>Unfollow Calendar</h4>
              <p>Remove this calendar from your list. You can be re-invited later.</p>
              <CustomButton
                onClick={handleUnfollow}
                disabled={isUnfollowing}
                variant="danger"
              >
                {isUnfollowing ? 'Unfollowing...' : 'Unfollow Calendar'}
              </CustomButton>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CalendarSettings;
