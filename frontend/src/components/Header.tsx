import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          Game Hub
        </Link>

        <div className="auth-section">
          {isAuthenticated && user ? (
            <div className="user-menu-container" ref={menuRef}>
              <button
                className="user-menu-button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                {user.username}
                <span className={`arrow ${isUserMenuOpen ? 'up' : 'down'}`}>▼</span>
              </button>
              
              {isUserMenuOpen && (
                <div className="user-menu" style={{ zIndex: 1000 }}>
                  <div className="menu-header">
                    <span className="user-info">Signed in as</span>
                    <strong>{user.username}</strong>
                  </div>
                  <div className="menu-divider" />
                  <button 
                    className="menu-item" 
                    onClick={handleLogout}
                    style={{ cursor: 'pointer', width: '100%', textAlign: 'left' }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-button login">
                Log In
              </Link>
              <Link to="/signup" className="auth-button signup">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 