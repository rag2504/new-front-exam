import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { CalendarDays, AlertCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/appointments/my');
      setAppointments(data);
    } catch (err) {
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'queued': return 'badge-queued';
      case 'waiting': return 'badge-waiting';
      case 'in_progress': return 'badge-in_progress';
      case 'done': return 'badge-done';
      case 'skipped': return 'badge-skipped';
      default: return 'badge-queued';
    }
  };

  if (loading) return <div className="loader-container"><div className="spinner"></div></div>;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <CalendarDays size={28} /> My Appointments
      </h2>

      {error && <div className="alert alert-error"><span>{error}</span></div>}

      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date & Time</th>
              <th>Token</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt.id}>
                <td style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>#{String(apt.id).padStart(4, '0')}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600 }}>{new Date(apt.appointmentDate || apt.date).toLocaleDateString()}</span>
                    <span className="text-secondary" style={{ fontSize: '0.875rem' }}>{apt.timeSlot}</span>
                  </div>
                </td>
                <td>
                  {apt.queueEntry ? (
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                      #{apt.queueEntry.tokenNumber}
                    </span>
                  ) : (
                    <span className="text-tertiary">N/A</span>
                  )}
                </td>
                <td>
                  <span className={`badge ${getStatusBadgeColor(apt.status)}`}>
                    {(apt.status || 'queued').replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <Link to={`/patient/appointments/${apt.id}`} className="btn btn-outline btn-icon-only">
                    <ExternalLink size={18} />
                  </Link>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
                  <AlertCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <p>You have no appointments yet.</p>
                  <Link to="/patient/book" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
                    Book Your First Appointment
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAppointments;
