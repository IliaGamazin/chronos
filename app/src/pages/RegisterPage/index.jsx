import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '@/components/AuthForm/AuthForm';
import { useAuth } from '@/hooks/useAuth';

const REGISTER_FIELDS = [
  {
    name: 'login',
    type: 'text',
    label: 'Username',
    placeholder: 'Choose a username',
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
  },
  {
    name: 'full_name',
    type: 'text',
    label: 'Full Name',
    placeholder: 'Enter your full name',
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Create a password',
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: 'Confirm Password',
    placeholder: 'Confirm your password',
  },
];

const RegisterPage = () => {
  const { register, isRegistering, registerError } = useAuth();
  const [validationError, setValidationError] = useState(null);

  const handleSubmit = formData => {
    setValidationError(null);

    if (formData.password !== formData.confirmPassword) {
      setValidationError({ message: 'Passwords do not match' });
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    register(registerData);
  };

  return (
    <AuthForm
      title="Create Account"
      fields={REGISTER_FIELDS}
      submitButtonText="Sign Up"
      loadingText="Creating account..."
      onSubmit={handleSubmit}
      isLoading={isRegistering}
      error={validationError || registerError}
      footer={
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      }
    />
  );
};

export default RegisterPage;
