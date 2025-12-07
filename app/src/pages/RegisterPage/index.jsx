import { Link } from 'react-router-dom';
import AuthForm from '@/components/AuthForm/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

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
  const { register, isRegistering } = useAuth();

  const handleSubmit = formData => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
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
      footer={
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      }
    />
  );
};

export default RegisterPage;
