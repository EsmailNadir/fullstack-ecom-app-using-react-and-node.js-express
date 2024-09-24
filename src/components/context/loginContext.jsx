import { createContext, useState } from "react";

// Create the context
export const LoginContext = createContext();

// Create the provider component
export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Initialize state based on token presence in localStorage
    return !!localStorage.getItem('token');
  });

  // Function to handle login
  const login = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  // Provide the isLoggedIn state and authentication functions to children components
  return (
    <LoginContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
