import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import Logo from '@/shared/Logo/Logo.jsx';
import './Header.module.css';

const getInitials = name => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const Header = ({ hideAvatar = false }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  return (
    <header className="dashboard-header">
      <Logo />

      {!hideAvatar && (
        <div
          className="header-user-avatar"
          onClick={() => navigate('/profile')}
        >
          {user?.pfp_url ? (
            <img src={user.pfp_url} alt="Profile" className="avatar-img" />
          ) : (
            <div className="header-avatar-placeholder">
              {getInitials(user?.full_name)}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
