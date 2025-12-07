import { Link } from 'react-router-dom';
import logoImg from '@/assets/logo.png';
import './Logo.css';

const Logo = ({ className = '', style = {} }) => {
  return (
    <Link to="/" className={`logo-link ${className}`} style={style}>
      <img src={logoImg} alt="WhaleWatch Logo" className="logo-image" />
      <span className="logo-text">
        Whale<span>Watch</span>
      </span>
    </Link>
  );
};

export default Logo;
