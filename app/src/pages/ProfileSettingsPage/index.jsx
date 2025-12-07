import { useAuthContext } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

import DashboardHeader from '@/components/Header/Header.jsx';

import '@/pages/ProfilePage/ProfilePage.css';
import { useEffect, useState } from 'react';
import ProfileSettingsForm from '@/components/Profile/ProfileSettingsForm';
import { useSetUserAvatar, useUpdateUser } from '@/hooks/useUser.js';

const ProfileSettingsPage = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { updateUser } = useAuthContext();

  const onUpdateUser = useUpdateUser();
  const onSetUserAvatar = useSetUserAvatar();

  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [formData, setFormData] = useState({
    login: user.login || '',
    full_name: user.full_name || '',
    email: user.email || '',
  });

  useEffect(() => {
    setAvatar(user?.pfp_url);
  }, [user]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatar(URL.createObjectURL(file));
  };

  const applyAvatar = async () => {
    if (!avatarFile) return;
    try {
      await onSetUserAvatar.mutateAsync({
        pfp_url: avatarFile,
      });
    } catch (err) {
      console.error('Avatar update failed:', err);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await onUpdateUser.mutateAsync({
        userData: formData,
      });

      updateUser({ ...user, ...formData });
      navigate('/dashboard');
    } catch (err) {
      console.error('Profile update failed:', err);
    }
  };

  return (
    <div className="profile-page">
      <DashboardHeader hideAvatar={true} />

      <div className="profile-container">
        <ProfileSettingsForm
          userFullName={formData.full_name}
          userLogin={formData.login}
          userAvatar={avatar}
          onUserFullNameChange={handleChange}
          onUserLoginChange={handleChange}
          onUserAvatarChange={handleAvatarChange}
          onSubmitAvatar={applyAvatar}
          onSubmit={handleSubmit}
          isSaving={onUpdateUser.isPending || onSetUserAvatar.isPending}
        />
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
