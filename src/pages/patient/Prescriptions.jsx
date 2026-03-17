import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Pill, AlertCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const { data } = await api.get('/prescriptions/my');
      setPrescriptions(data);
    } catch (err) {
      setError('Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loader-container"><div className="spinner"></div></div>;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Pill size={28} className="text-primary" /> My Prescriptions
      </h2>

      {error && <div className="alert alert-error"><span>{error}</span></div>}

      <div className="grid-2">
        {prescriptions.map((px) => (
           <div key={px.id} className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
               <div>
                  <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Appointment Date</h4>
                  <p style={{ fontWeight: 600 }}>{new Date(px.appointment?.date || px.createdAt).toLocaleDateString()}</p>
               </div>
               <Link to={`/patient/appointments/${px.appointmentId || px.appointment?.id}`} className="btn btn-outline btn-icon-only">
                 <FileText size={16} />
               </Link>
             </div>
             
             <div>
               <h4 style={{ fontSize: '0.875rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Medicines</h4>
               {px.medicines && px.medicines.length > 0 ? (
                 <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                   {px.medicines.map((med, i) => (
                     <li key={i} style={{ marginBottom: '0.25rem' }}>
                       <span style={{ fontWeight: 500 }}>{med.name}</span> - <span className="text-secondary">{med.dosage}</span>
                     </li>
                   ))}
                 </ul>
               ) : <span className="text-secondary">No medicines listed.</span>}
             </div>
             
             {px.notes && (
               <div style={{ padding: '0.75rem', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)' }}>
                 <p style={{ fontSize: '0.875rem' }}><strong>Notes:</strong> {px.notes}</p>
               </div>
             )}
           </div>
        ))}
        {prescriptions.length === 0 && (
          <div className="card glass-panel flex-col justify-center items-center" style={{ gridColumn: 'span 2', padding: '3rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
            <AlertCircle size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <p>You have no prescriptions yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;
