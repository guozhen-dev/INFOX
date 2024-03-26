import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Simulate a login function
  const login = (userData) => {
    console.log(userData);
    setUser(userData);
    // TODO: persist the user login data.
    chrome.storage.sync.set({ user: userData }, function () {
      console.log('Value is set to ' + userData);
    });
  };

  // Simulate a logout function
  const logout = () => {
    setUser(null);
    chrome.storage.sync.remove('user', function () {
      console.log('Value is removed');
    });
  };

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
