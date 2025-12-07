import { useState } from 'react';
import CustomInput from '@/shared/CustomInput';
import CustomButton from '@/shared/CustomButton';
import styles from './AuthForm.module.css';
import Logo from '@/shared/Logo/Logo.jsx';

const AuthForm = ({
  title,
  fields,
  submitButtonText,
  loadingText,
  onSubmit,
  isLoading,
  footer,
}) => {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={styles.authFormContainer}>
      <div className={styles.logoWrapper}>
        <Logo />
      </div>
      <div className={styles.authFormCard}>
        <h1 className={styles.title}>{title}</h1>

        {/* A MOJET I NET, TOAST CARRIES */}
        {/* LASST ES SEIN */}

        <form onSubmit={handleSubmit} className={styles.form}>
          {fields.map(field => (
            <CustomInput
              key={field.name}
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              label={field.label}
              required={field.required !== false}
            />
          ))}

          <CustomButton type="submit" isLoading={isLoading}>
            {isLoading ? loadingText : submitButtonText}
          </CustomButton>
        </form>

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
};

export default AuthForm;
