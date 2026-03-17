import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, FileText, Pill, Stethoscope, AlertCircle } from 'lucide-react';

const AppointmentDetails = () => {
  const { id } = useParams();
  const [apt, setApt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const fetchAppointment = async () => {
    try {
      const { data } = await api.get(`/appointments/${id}`);
      setApt(data);
    } catch (err) {
      setError('Failed to fetch appointment details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    if (!status) return 'badge-queued';
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
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!apt) return null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/patient/appointments" className="btn btn-outline btn-icon-only" style={{ padding: '0.5rem', borderRadius: '50%' }}>
          <ArrowLeft size={20} />
        </Link>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 0 }}>
          Appointment Details
        </h2>
        <span className={`badge ${getStatusBadgeColor(apt.status)}`} style={{ marginLeft: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          {apt.status?.replace('_', ' ')}
        </span>
      </div>

      <div className="grid-2">
        <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>General Info</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', width: '48px', height: '48px' }}>
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Date</p>
                <p style={{ fontWeight: 600, fontSize: '1.125rem' }}>{new Date(apt.appointmentDate || apt.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div className="stat-icon" style={{ backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)', width: '48px', height: '48px' }}>
                <Clock size={24} />
              </div>
              <div>
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Time Slot</p>
                <p style={{ fontWeight: 600, fontSize: '1.125rem' }}>{apt.timeSlot}</p>
              </div>
            </div>

            {apt.queueEntry && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface-hover)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Queue Token Number</div>
                <div style={{ marginLeft: 'auto', fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>#{apt.queueEntry.tokenNumber}</div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card glass-panel">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <Pill size={20} className="text-primary" /> Prescription
            </h3>
            {apt.prescription ? (
              <div>
                {apt.prescription.medicines && apt.prescription.medicines.length > 0 ? (
                  <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                    {apt.prescription.medicines.map((med, i) => (
                      <li key={i} style={{ padding: '0.75rem', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem', borderLeft: '3px solid var(--primary)' }}>
                        <span style={{ fontWeight: 600 }}>{med.name}</span> - <span className="text-secondary">{med.dosage}</span> ({med.duration})
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-secondary">No medicines prescribed.</p>}
                
                {apt.prescription.notes && (
                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#FEF3C7', color: '#92400E', borderRadius: 'var(--radius-md)' }}>
                    <strong>Notes:</strong> {apt.prescription.notes}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} /> No prescription has been added yet.
              </div>
            )}
          </div>

          <div className="card glass-panel">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <FileText size={20} className="text-secondary" /> Medical Report
            </h3>
            {apt.report ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Diagnosis</h4>
                  <p style={{ fontWeight: 500, fontSize: '1.125rem' }}>{apt.report.diagnosis}</p>
                </div>
                
                <div>
                  <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Recommended Tests</h4>
                  <p>{apt.report.tests || 'None'}</p>
                </div>
                
                {apt.report.remarks && (
                  <div>
                    <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Remarks</h4>
                    <p style={{ backgroundColor: 'var(--surface-hover)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>{apt.report.remarks}</p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} /> No report has been added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
