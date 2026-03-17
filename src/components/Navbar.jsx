import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="top-navbar">
      <div className="user-profile">
        <div className="user-info" style={{ textAlign: 'right' }}>
          <span>{user?.name || 'User'}</span>
          <span>{user?.clinicName || 'Clinic'}</span>
        </div>
        
        <div className="user-avatar">
          {getInitials(user?.name)}
        </div>
        
        <button 
          onClick={handleLogout}
          className="btn btn-outline btn-icon-only" 
          title="Logout"
          style={{ marginLeft: '1rem', border: 'none', background: 'var(--danger-light)', color: 'var(--danger)' }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
