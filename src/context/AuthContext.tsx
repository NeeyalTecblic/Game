import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for saved user data on component mount
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    // In a real app, you would validate credentials against a backend
    // For now, we'll simulate authentication
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.username === username && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const userData = { username: user.username, id: user.id };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const signup = async (username: string, password: string) => {
    // In a real app, you would create user in a backend
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some((u: any) => u.username === username)) {
      throw new Error('Username already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      password
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto login after signup
    const userData = { username: newUser.username, id: newUser.id };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 