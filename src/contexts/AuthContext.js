import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { userService } from '../firebase/services';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const data = await userService.getUserData(user.uid);
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email, password, userData) => {
    try {
      const result = await userService.register(email, password, userData);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const result = await userService.login(email, password);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await userService.logout();
    } catch (error) {
      throw error;
    }
  };

  const updateUserProfile = async (userData) => {
    try {
      if (currentUser) {
        await userService.updateUserData(currentUser.uid, userData);
        // Refresh user data
        const updatedData = await userService.getUserData(currentUser.uid);
        setUserData(updatedData);
      }
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
    userData,
    loading,
    register,
    login,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 