import './CustomButton.css';

const CustomButton = ({
  type = 'button',
  onClick,
  children,
  disabled = false,
  variant = 'primary',
  isLoading = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`custom-button ${variant} ${isLoading ? 'loading' : ''}`}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

export default CustomButton;
