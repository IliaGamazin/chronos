import './CustomSelect.css';

const CustomSelect = ({
  label,
  id,
  name,
  value,
  onChange,
  required,
  children,
  className = '',
  ...rest
}) => {
  return (
    <div className={`select-group ${className}`}>
      {label && (
        <label htmlFor={id} className="select-label">
          {label}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="select-field"
        {...rest}
      >
        {children}
      </select>
    </div>
  );
};

export default CustomSelect;
