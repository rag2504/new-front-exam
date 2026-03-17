import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  UserPlus, 
  CalendarPlus, 
  CalendarDays, 
  FileText, 
  Stethoscope, 
  ListOrdered
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  
  const getNavLinks = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
          { name: 'Clinic Info', path: '/admin/clinic', icon: <Building2 size={20} /> },
          { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
          { name: 'Create User', path: '/admin/create-user', icon: <UserPlus size={20} /> },
        ];
      case 'patient':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
          { name: 'Book Appointment', path: '/patient/book', icon: <CalendarPlus size={20} /> },
          { name: 'My Appointments', path: '/patient/appointments', icon: <CalendarDays size={20} /> },
          { name: 'Prescriptions', path: '/patient/prescriptions', icon: <FileText size={20} /> },
          { name: 'Reports', path: '/patient/reports', icon: <Stethoscope size={20} /> },
        ];
      case 'receptionist':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
          { name: 'Daily Queue', path: '/receptionist/queue', icon: <ListOrdered size={20} /> },
        ];
      case 'doctor':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
          { name: "Today's Queue", path: '/doctor/queue', icon: <ListOrdered size={20} /> },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Stethoscope size={28} className="text-primary" style={{ color: 'var(--primary)' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>CMS Health</h2>
      </div>
      
      <nav className="sidebar-nav">
        {navLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
          Logged in as <b>{user?.role?.toUpperCase()}</b>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
