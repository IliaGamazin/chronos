import { useAuthContext } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import CustomButton from '@/shared/CustomButton';
import Header from '@/components/Header/Header.jsx';

import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuthContext();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = name => {
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
        <Header hideAvatar={true} />

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

            <div className="profile-actions">
              <CustomButton
                className="profile-settings-button"
                onClick={() => navigate('/settings')}
              >
                Edit Profile
              </CustomButton>

              <CustomButton
                className="profile-logout-button"
                variant="danger"
                onClick={logout}
              >
                Logout
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
