import CustomInput from '@/shared/CustomInput';
import CustomButton from '@/shared/CustomButton';
import { formatErrorMessage } from '@/utils/errorUtils';

import AvatarChange from './AvatarChange';

const ProfileSettingsForm = ({
  userFullName,
  userLogin,
  //userEmail,
  userAvatar,
  onUserFullNameChange,
  onUserLoginChange,
  //onUserEmailChange,
  onUserAvatarChange,
  onSubmit,
  onSubmitAvatar,
  isSaving,
	error,
}) => {
  return (
    <form className="profile-content" onSubmit={onSubmit}>
      <div className="profile-card">
        <h2 className="settings-title">Edit Your Profile</h2>

        <AvatarChange 
          userAvatar={userAvatar}
          onUserAvatarChange={onUserAvatarChange}
          onSubmit={onSubmitAvatar}
        />

        <div className="settings-form">
					{error && (
						<div className="error">
							{typeof error === 'string'
								? error
								: error?.message ||
									formatErrorMessage(error) ||
									'An error occurred'}
						</div>
					)}

          <CustomInput
            name="full_name"
            label="Full Name"
            value={userFullName}
            onChange={onUserFullNameChange}
          />

          <CustomInput
            name="login"
            label="Username"
            value={userLogin}
            onChange={onUserLoginChange}
          />

          {/* <CustomInput
            name="email"
            label="Email"
            value={userEmail}
            onChange={onUserEmailChange}
          /> */}
        </div>

        <CustomButton
          type="submit"
          className="settings-save-button"
          isLoading={isSaving}
        >
          Save Changes
        </CustomButton>
      </div>
    </form>
  );
};

export default ProfileSettingsForm;
