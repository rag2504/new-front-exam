import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Building2, Users, Stethoscope, Briefcase } from 'lucide-react';

const ClinicInfo = () => {
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClinicInfo();
  }, []);

  const fetchClinicInfo = async () => {
    try {
      const { data } = await api.get('/admin/clinic');
      setClinic(data);
    } catch (err) {
      setError('Failed to fetch clinic information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loader-container"><div className="spinner"></div></div>;
  if (error) return <div className="alert alert-error"><span>{error}</span></div>;
  if (!clinic) return null;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Building2 size={28} /> Clinic Information
      </h2>
      
      <div className="card glass-panel flex flex-col gap-6" style={{ maxWidth: '800px' }}>
        <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <p className="text-secondary" style={{ fontSize: '0.875rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Clinic Name
          </p>
          <h3 style={{ fontSize: '1.875rem', color: 'var(--primary)', marginTop: '0.5rem' }}>
            {clinic.name}
          </h3>
          
          <div style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--surface-hover)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>
            <span className="text-secondary">Clinic Code:</span>
            <span style={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: '1.125rem' }}>{clinic.code}</span>
          </div>
        </div>
        
        <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Staff & Patients Overview</h4>
        
        <div className="grid-3">
          <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Stethoscope size={24} />
            </div>
            <div>
              <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Doctors</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{clinic.doctorsCount}</p>
            </div>
          </div>
          
          <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="stat-icon" style={{ backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)' }}>
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Receptionists</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{clinic.receptionistsCount}</p>
            </div>
          </div>
          
          <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="stat-icon" style={{ backgroundColor: 'var(--accent-light)', color: '#D97706' }}>
              <Users size={24} />
            </div>
            <div>
              <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Patients</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{clinic.patientsCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicInfo;
