'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const checkUserLoggedIn = () => {
      console.log(localStorage.getItem('userToken'));
      const isLoggedIn = !!localStorage.getItem('userToken');

      if (!isLoggedIn) {
        router.push('/login');
      }
      else{
        router.push('/dashboard');
      }
    };

    checkUserLoggedIn();
  }, [router]);
};

export default useAuth;
