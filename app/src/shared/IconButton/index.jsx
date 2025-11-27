import './IconButton.css';

const IconButton = ({
  type = 'button',
  onClick,
  children,
  disabled = false,
  title,
  variant = 'primary',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`icon-button ${variant}`}
      title={title}
    >
      {children}
    </button>
  );
};

export default IconButton;
