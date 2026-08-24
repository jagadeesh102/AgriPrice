import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('agriprice_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('agriprice_token') || '');

  const loginUser = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('agriprice_user', JSON.stringify(userData));
    localStorage.setItem('agriprice_token', userToken);
  };

  const logoutUser = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('agriprice_user');
    localStorage.removeItem('agriprice_token');
  };

  // Hackathon Quick Demo Mode for Judges
  const triggerJudgeDemo = () => {
    const demoUser = {
      id: "user_demo_farmer",
      name: "Jagadeesh (Judge Demo)",
      mobile: "6303403633",
      email: "jagadeeshtippani@gmail.com",
      district: "Guntur",
      preferred_language: "en",
      primary_crop: "chilli",
      is_admin: false,
      is_demo_mode: true
    };
    loginUser(demoUser, "demo_jwt_token_for_Preview_Farmers_2026");
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser, triggerJudgeDemo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
