import './CustomTextarea.css';

const CustomTextarea = ({
  name,
  value,
  onChange,
  placeholder,
  required = false,
  label,
  rows = 3,
}) => {
  return (
    <div className="textarea-wrapper">
      {label && <label htmlFor={name}>{label}</label>}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
      />
    </div>
  );
};

export default CustomTextarea;
