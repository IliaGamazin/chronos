import { Upload } from 'lucide-react';

import CustomButton from '@/shared/CustomButton';

const AvatarChange = ({
  userAvatar,
  onUserAvatarChange,
  onSubmit,
}) => {
  return (
    <div className="avatar-section">
      <div className="profile-avatar settings-avatar">
        {userAvatar ? (
          <img src={userAvatar} alt="Avatar preview" />
        ) : (
          <div className="avatar-placeholder">No photo</div>
        )}
      </div>

      <div className="avatar-buttons">
        <label htmlFor="avatar-input" className="avatar-upload-label">
          <Upload size={16} />
          <span>Choose photo</span>
        </label>

        <input
          id="avatar-input"
          type="file"
          accept="image/*"
          onChange={onUserAvatarChange}
          className="avatar-input"
        />

        {userAvatar && (
          <CustomButton type="button" onClick={onSubmit}>
            Apply
          </CustomButton>
        )}
      </div>
    </div>
  );
};

export default AvatarChange;
