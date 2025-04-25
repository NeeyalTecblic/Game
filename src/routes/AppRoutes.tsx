import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import GamePage from '../pages/GamePage';
import TicTacToePage from '../pages/TicTacToePage';
import SnakeGame from '../pages/SnakeGame';
import TicTacToeDashboard from '../pages/TicTacToeDashboard';
import SnakeDashboard from '../pages/SnakeDashboard';
import MemoryDashboard from '../pages/MemoryDashboard';

// Protected Route wrapper component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/login" 
        element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
      />
      <Route 
        path="/signup" 
        element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} 
      />
      <Route 
        path="/game" 
        element={
          <ProtectedRoute>
            <GamePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/stats" 
        element={
          <ProtectedRoute>
            <GamePage />
          </ProtectedRoute>
        } 
      />
      <Route path="/memory-dashboard" element={isAuthenticated ? <MemoryDashboard /> : <Navigate to="/login" />} />
      <Route path="/tic-tac-toe" element={isAuthenticated ? < TicTacToePage/> : <Navigate to="/login"/>} />
      <Route path="/tictactoe-dashboard" element={isAuthenticated ? < TicTacToeDashboard/> : <Navigate to="/login"/>} />
      <Route path="/snake" element={isAuthenticated ? < SnakeGame/> : <Navigate to="/login"/>} />
      <Route path="/snake-dashboard" element={isAuthenticated ? < SnakeDashboard/> : <Navigate to="/login"/>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 