import { useState, useEffect } from 'react';
import { getCurrentUser, getStoredUser, initializeAuth } from '../services/auth';

export const useAuth = () => {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        initializeAuth(); // Initialize auth state from localStorage
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { user, loading };
}; 