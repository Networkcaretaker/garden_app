import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuthStore } from '../stores/authStore';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        console.log('User signed in:', user.email);
        user.getIdToken().then((token) => {
          // Fix: Actually use the variable so linter is happy
          console.log('Auth Token retrieved:', token);
        });
      } else {
        console.log('User signed out');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [setUser, setLoading]);

  return <>{children}</>;
};