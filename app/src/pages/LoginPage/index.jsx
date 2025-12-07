import { Link } from 'react-router-dom';
import AuthForm from '@/components/AuthForm/AuthForm';
import { useAuth } from '@/hooks/useAuth';

const LOGIN_FIELDS = [
  {
    name: 'login',
    type: 'text',
    label: 'Username',
    placeholder: 'Enter your username',
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
  },
];

const LoginPage = () => {
  const { login, isLoggingIn } = useAuth();

  const handleSubmit = formData => {
    login(formData);
  };

  return (
    <AuthForm
      title="Welcome Back"
      fields={LOGIN_FIELDS}
      submitButtonText="Log In"
      loadingText="Logging in..."
      onSubmit={handleSubmit}
      isLoading={isLoggingIn}
      footer={
        <p>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      }
    />
  );
};

export default LoginPage;
