import './Checkbox.css';

const Checkbox = ({
  checked,
  onChange,
  className = '',
  variant = 'default',
}) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={`checkbox checkbox--${variant} ${className}`}
    />
  );
};

export default Checkbox;