import { useAuthContext } from '@/context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import CustomButton from '@/shared/CustomButton';
import IconButton from '@/shared/IconButton';

import "./ProfilePage.css";

const ProfilePage = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <IconButton 
            onClick={() => navigate("/dashboard")} 
            variant="secondary" 
            title="Back to dashboard"
          >
            <ArrowLeft size={20} />
          </IconButton>
          <h1 className="profile-title">Profile</h1>
        </div>
        
        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-avatar">
              {user?.pfp_url ? (
                <img src={user.pfp_url} alt="Profile" />
              ) : (
                <span>{getInitials(user?.full_name)}</span>
              )}
            </div>

            <h2 className="profile-name">{user?.full_name}</h2>
            <p className="profile-username">@{user?.login}</p>
            <p className="profile-email">{user?.email}</p>

            <CustomButton 
              className="profile-settings-button" 
              onClick={() => navigate("/settings")}
            >
              Edit Profile
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
