import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Users, FileText, Calendar, Building2, ListOrdered, CalendarPlus, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (user.role === 'admin') {
        const { data } = await api.get('/admin/clinic');
        setStats({ totalUsers: data.doctorsCount + data.patientsCount + data.receptionistsCount });
      } else if (user.role === 'patient') {
        const { data } = await api.get('/appointments/my');
        setStats({ appointments: data.length });
      } else if (user.role === 'receptionist') {
        const today = new Date().toISOString().split('T')[0];
        const { data } = await api.get(`/queue?date=${today}`);
        setStats({ queueCount: data.length });
      } else if (user.role === 'doctor') {
        const { data } = await api.get('/doctor/queue');
        setStats({ queueCount: data.length });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={32} /> {getGreeting()}, {user?.name.split(' ')[0]}
        </h1>
        <p className="text-secondary">
          Welcome to {user?.clinicName} ({user?.clinicCode})
        </p>
      </div>

      <div className="grid-3">
        <div className="card glass-panel flex-col justify-center">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Building2 size={24} />
            </div>
            <div className="stat-info">
              <h4>Clinic Info</h4>
              <p style={{ fontSize: '1rem', marginTop: '0.5rem', fontWeight: '500' }}>{user?.clinicName}</p>
            </div>
          </div>
        </div>

        <div className="card glass-panel flex-col justify-center">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)' }}>
              <Users size={24} />
            </div>
            <div className="stat-info">
              <h4>Role</h4>
              <p style={{ textTransform: 'capitalize' }}>{user?.role}</p>
            </div>
          </div>
        </div>

        <div className="card glass-panel flex-col justify-center">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--accent-light)', color: '#D97706' }}>
              <Calendar size={24} />
            </div>
            <div className="stat-info">
              <h4>Date</h4>
              <p style={{ fontSize: '1.25rem', marginTop: '0.5rem', fontWeight: '600' }}>
                {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Quick Links</h3>
        <div className="grid-4">
          {user?.role === 'patient' && (
            <>
              <Link to="/patient/book" className="card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                <CalendarPlus size={24} style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Book Appointment</span>
              </Link>
              <Link to="/patient/appointments" className="card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                <Calendar size={24} style={{ color: 'var(--secondary)' }} />
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>My Appointments</span>
              </Link>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <Link to="/admin/clinic" className="card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                <Building2 size={24} style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Clinic Details</span>
              </Link>
              <Link to="/admin/users" className="card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                <Users size={24} style={{ color: 'var(--secondary)' }} />
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Manage Users</span>
              </Link>
            </>
          )}

          {(user?.role === 'receptionist' || user?.role === 'doctor') && (
            <Link to={user?.role === 'receptionist' ? '/receptionist/queue' : '/doctor/queue'} className="card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
              <ListOrdered size={24} style={{ color: 'var(--primary)' }} />
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Manage Queue</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
