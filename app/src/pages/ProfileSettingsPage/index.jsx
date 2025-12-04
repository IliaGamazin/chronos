import { useAuthContext } from '@/context/AuthContext';
import { ArrowLeft, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

import CustomButton from '@/shared/CustomButton';
import IconButton from '@/shared/IconButton';

import "@/pages/ProfilePage/ProfilePage.css";
import { useEffect, useState } from 'react';
import ProfileSettingsForm from "@/components/Profile/ProfileSettingsForm";

const ProfileSettingsPage = () => {
  const { user } = useAuthContext();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    login: user.login || "",
    full_name: user.full_name || "",
    email: user.email || "",
  });

  useEffect(() => {
    setAvatar(user?.pfp_url);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatar(URL.createObjectURL(file));
  };

  const applyAvatar = async () => {
    if (!avatarFile) return;
    // api call
    console.log("Uploaded avatar:", avatarFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    console.log("Current form:", formData);
    // api call
    setIsSaving(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <IconButton
          onClick={() => navigate("/profile")}
          variant="secondary"
          title="Back to profile"
        >
          <ArrowLeft size={20} />
        </IconButton>
        <h1 className="profile-title">Profile Settings</h1>
      </div>

      <ProfileSettingsForm
        userFullName={formData.full_name}
        userLogin={formData.login}
        userEmail={formData.email}
        userAvatar={avatar}
        onUserFullNameChange={handleChange}
        onUserLoginChange={handleChange}
        onUserEmailChange={handleChange}
        onUserAvatarChange={handleAvatarChange}
        onSubmitAvatar={applyAvatar}
        onSubmit={handleSubmit}
        isSaving={isSaving}
      />

      <div className="logout-section">
        <CustomButton 
            variant="danger" 
            className="logout-btn" 
            onClick={logout}
          >
          Logout
        </CustomButton>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
