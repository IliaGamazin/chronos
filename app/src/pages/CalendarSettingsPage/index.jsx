import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useCalendar, useUpdateCalendar, useDeleteCalendar, useUnfollowCalendar, useRemoveCollaborator } from '@/hooks/useCalendars';
import CustomInput from '@/shared/CustomInput';
import CustomTextarea from '@/shared/CustomTextarea';
import CustomButton from '@/shared/CustomButton';
import IconButton from '@/shared/IconButton';
import './CalendarSettingsPage.css';

const CalendarSettingsPage = () => {
  const { calendarId } = useParams();
  const navigate = useNavigate();
  const { data: calendarData, isLoading } = useCalendar(calendarId);
  const updateCalendarMutation = useUpdateCalendar();
  const deleteCalendarMutation = useDeleteCalendar();
  const unfollowCalendarMutation = useUnfollowCalendar();
  const removeCollaboratorMutation = useRemoveCollaborator();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
  });

  const calendar = calendarData?.data;

  useEffect(() => {
    if (calendar) {
      setFormData({
        name: calendar.name || '',
        description: calendar.description || '',
        color: calendar.color || '#3b82f6',
      });
    }
  }, [calendar]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    updateCalendarMutation.mutate(
      {
        calendarId: calendarId,
        calendarData: formData,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setFormData({
      name: calendar.name || '',
      description: calendar.description || '',
      color: calendar.color || '#3b82f6',
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${calendar?.name}"? This action cannot be undone.`
    );
    if (confirmed) {
      deleteCalendarMutation.mutate(calendarId, {
        onSuccess: () => {
          navigate('/dashboard');
        },
      });
    }
  };

  const handleUnfollow = () => {
    const confirmed = window.confirm(`Are you sure you want to unfollow "${calendar?.name}"?`);
    if (confirmed) {
      unfollowCalendarMutation.mutate(calendarId, {
        onSuccess: () => {
          navigate('/dashboard');
        },
      });
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (!calendar) {
    return (
      <div className="calendar-settings-page">
        <div className="loading-message">Loading calendar settings...</div>
      </div>
    );
  }

  const isOwner = !calendar.role || calendar.role === 'owner';
  const canEdit = isOwner || calendar.role === 'editor';

  return (
    <div className="calendar-settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <IconButton onClick={handleBack} variant="secondary" title="Back to dashboard">
            <ArrowLeft size={20} />
          </IconButton>
          <h1>Calendar Settings</h1>
        </div>

        <div className="settings-content">
          <section className="settings-section">
            <h2>Basic Information</h2>

            <CustomInput
              type="text"
              name="name"
              label="Calendar Name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />

            <CustomTextarea
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              disabled={!isEditing}
              rows={4}
            />

            <div className="color-input-wrapper">
              <label htmlFor="color">Color</label>
              <input
                type="color"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                disabled={!isEditing}
                className="calendar-color-input"
              />
            </div>

            {!isOwner && calendar.role && (
              <div className="read-only-field">
                <label>Your Role</label>
                <span className="role-badge">{calendar.role}</span>
              </div>
            )}
          </section>

          {(isOwner || calendar.role === 'editor') && (
            <section className="settings-section">
              <h2>Collaborators & Followers</h2>
              {calendar.collaborators && calendar.collaborators.length > 0 ? (
                <div className="collaborators-list">
                  {calendar.collaborators.map(collaborator => (
                    <div key={collaborator.id || collaborator._id} className="collaborator-item">
                      <div className="collaborator-info">
                        <span className="collaborator-name">{collaborator.full_name || collaborator.email}</span>
                        <span className="collaborator-role">{collaborator.role}</span>
                      </div>
                      {isOwner && (
                        <IconButton
                          onClick={() => {
                            const confirmed = window.confirm(
                              `Remove ${collaborator.full_name || collaborator.email} from this calendar?`
                            );
                            if (confirmed) {
                              removeCollaboratorMutation.mutate({
                                calendarId,
                                userId: collaborator.id || collaborator._id,
                              });
                            }
                          }}
                          variant="secondary"
                          title="Remove collaborator"
                          disabled={removeCollaboratorMutation.isPending}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="section-placeholder">
                  <p>No collaborators yet</p>
                  <p className="placeholder-hint">Share an invite link to add collaborators</p>
                </div>
              )}
            </section>
          )}

          <section className="settings-actions-section">
            <div className="action-group">
              {!isEditing && canEdit && (
                <CustomButton onClick={() => setIsEditing(true)} variant="primary">
                  Edit Calendar
                </CustomButton>
              )}

              {isEditing && (
                <>
                  <CustomButton
                    onClick={handleSave}
                    variant="primary"
                    disabled={updateCalendarMutation.isPending || !formData.name.trim()}
                  >
                    {updateCalendarMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </CustomButton>
                  <CustomButton
                    onClick={handleCancel}
                    variant="secondary"
                    disabled={updateCalendarMutation.isPending}
                  >
                    Cancel
                  </CustomButton>
                </>
              )}
            </div>

            {!isEditing && (
              <div className="danger-zone">
                <h3>Danger Zone</h3>
                {isOwner ? (
                  <CustomButton
                    onClick={handleDelete}
                    variant="danger"
                    disabled={deleteCalendarMutation.isPending}
                  >
                    {deleteCalendarMutation.isPending ? 'Deleting...' : 'Delete Calendar'}
                  </CustomButton>
                ) : (
                  <CustomButton
                    onClick={handleUnfollow}
                    variant="secondary"
                    disabled={unfollowCalendarMutation.isPending}
                  >
                    {unfollowCalendarMutation.isPending ? 'Unfollowing...' : 'Unfollow Calendar'}
                  </CustomButton>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default CalendarSettingsPage;
