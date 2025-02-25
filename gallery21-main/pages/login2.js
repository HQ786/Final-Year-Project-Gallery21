// pages/login.js
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to homepage or dashboard
    router.push('/');
  }, []);

  return null;
};

export default Login;
