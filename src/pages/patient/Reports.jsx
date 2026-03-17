import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Pill as FileTextIcon, AlertCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await api.get('/reports/my');
      setReports(data);
    } catch (err) {
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loader-container"><div className="spinner"></div></div>;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FileTextIcon size={28} className="text-secondary" /> My Medical Reports
      </h2>

      {error && <div className="alert alert-error"><span>{error}</span></div>}

      <div className="grid-2">
        {reports.map((report) => (
           <div key={report.id} className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
               <div>
                  <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Appointment Date</h4>
                  <p style={{ fontWeight: 600 }}>{new Date(report.appointment?.date || report.createdAt).toLocaleDateString()}</p>
               </div>
               <Link to={`/patient/appointments/${report.appointmentId || report.appointment?.id}`} className="btn btn-outline btn-icon-only">
                 <ExternalLink size={16} />
               </Link>
             </div>
             
             <div>
               <h4 style={{ fontSize: '0.875rem', color: 'var(--secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Diagnosis</h4>
               <p style={{ fontWeight: 500, fontSize: '1.125rem' }}>{report.diagnosis}</p>
             </div>
             
             {report.tests && (
               <div>
                 <h4 style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>Recommended Tests</h4>
                 <p style={{ fontSize: '0.875rem' }}>{report.tests}</p>
               </div>
             )}
             
             {report.remarks && (
               <div style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)' }}>
                 <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Remarks</h4>
                 <p style={{ fontSize: '0.875rem' }}>{report.remarks}</p>
               </div>
             )}
           </div>
        ))}
        {reports.length === 0 && (
          <div className="card glass-panel flex-col justify-center items-center" style={{ gridColumn: 'span 2', padding: '3rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
            <AlertCircle size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <p>You have no medical reports yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
