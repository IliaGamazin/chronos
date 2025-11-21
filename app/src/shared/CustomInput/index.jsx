import './CustomInput.css';

const CustomInput = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  label,
}) => {
  return (
    <div className="input-wrapper">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default CustomInput;
