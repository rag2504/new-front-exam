import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Stethoscope, Pill, FileText, X, Save } from 'lucide-react';

const TodayQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'prescription' or 'report'
  const [selectedAptId, setSelectedAptId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Prescription Form
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', duration: '' }]);
  const [notes, setNotes] = useState('');

  // Report Form
  const [diagnosis, setDiagnosis] = useState('');
  const [tests, setTests] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const { data } = await api.get('/doctor/queue');
      setQueue(data);
    } catch (err) {
      setError('Failed to fetch today\'s queue');
    } finally {
      setLoading(false);
    }
  };

  const openForm = (type, aptId) => {
    setFormError('');
    setFormSuccess('');
    setSelectedAptId(aptId);
    setActiveModal(type);
    
    // Reset forms
    if (type === 'prescription') {
      setMedicines([{ name: '', dosage: '', duration: '' }]);
      setNotes('');
    } else {
      setDiagnosis('');
      setTests('');
      setRemarks('');
    }
  };

  const closeForm = () => {
    setActiveModal(null);
    setSelectedAptId(null);
  };

  const handleMedChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', duration: '' }]);
  };

  const submitPrescription = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    
    try {
      const filteredMeds = medicines.filter(m => m.name.trim() !== '');
      await api.post(`/prescriptions/${selectedAptId}`, {
        medicines: filteredMeds,
        notes
      });
      setFormSuccess('Prescription saved successfully');
      fetchQueue();
      setTimeout(closeForm, 1500);
    } catch (err) {
      let errorMsg = 'Failed to save prescription';
      if (err.response?.data?.error) errorMsg = err.response.data.error;
      else if (err.response?.data?.message) errorMsg = err.response.data.message;
      else if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) errorMsg = err.response.data.detail.map(d => `${d.loc ? d.loc.join('.') : 'field'}: ${d.msg}`).join(', ');
        else errorMsg = err.response.data.detail;
      }
      setFormError(errorMsg);
    } finally {
      setFormLoading(false);
    }
  };

  const submitReport = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    
    try {
      await api.post(`/reports/${selectedAptId}`, {
        diagnosis,
        testRecommended: tests,
        remarks
      });
      setFormSuccess('Report saved successfully');
      fetchQueue();
      setTimeout(closeForm, 1500);
    } catch (err) {
      let errorMsg = 'Failed to save report';
      if (err.response?.data?.error) errorMsg = err.response.data.error;
      else if (err.response?.data?.message) errorMsg = err.response.data.message;
      else if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) errorMsg = err.response.data.detail.map(d => `${d.loc ? d.loc.join('.') : 'field'}: ${d.msg}`).join(', ');
        else errorMsg = err.response.data.detail;
      }
      setFormError(errorMsg);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Stethoscope size={28} className="text-secondary" /> Today's Patient Queue
        </h2>
      </div>

      {error && <div className="alert alert-error"><span>{error}</span></div>}

      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Patient Name</th>
              <th>Appointment ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                  <div className="spinner" style={{ margin: '0 auto' }}></div>
                </td>
              </tr>
            ) : queue.length > 0 ? (
              queue.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                      #{item.tokenNumber}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{item.appointment?.patient?.name || item.patientName || 'Unknown Patient'}</span>
                  </td>
                  <td>
                    <span className="text-secondary" style={{ fontFamily: 'monospace' }}>
                      #{String(item.appointmentId).padStart(4, '0')}
                    </span>
                  </td>
                  <td>
                     <span className={`badge`} style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                         className="btn btn-outline btn-icon-only text-primary" 
                         title="Add Prescription"
                         style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                         onClick={() => openForm('prescription', item.appointmentId)}
                      >
                         <Pill size={16} />
                      </button>
                      <button 
                         className="btn btn-outline btn-icon-only text-secondary" 
                         title="Add Report"
                         style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}
                         onClick={() => openForm('report', item.appointmentId)}
                      >
                         <FileText size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
                  No patients in your queue right now.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Models / Dialogs */}
      {activeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                {activeModal === 'prescription' ? (
                  <><Pill className="text-primary" /> Add Prescription</>
                ) : (
                  <><FileText className="text-secondary" /> Add Medical Report</>
                )}
              </h3>
              <button onClick={closeForm} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} className="text-secondary" />
              </button>
            </div>
            
            <div className="modal-body">
              {formError && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{formError}</div>}
              {formSuccess && <div className="alert alert-success" style={{ marginBottom: '1rem' }}>{formSuccess}</div>}
              
              {activeModal === 'prescription' ? (
                <form id="presc-form" onSubmit={submitPrescription}>
                  <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ margin: 0 }}>Medicines</label>
                    <button type="button" onClick={addMedicine} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                      + Add Drug
                    </button>
                  </div>
                  
                  {medicines.map((med, index) => (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input type="text" placeholder="Drug name" className="input-field" value={med.name} onChange={(e) => handleMedChange(index, 'name', e.target.value)} required />
                      <input type="text" placeholder="Dosage" className="input-field" value={med.dosage} onChange={(e) => handleMedChange(index, 'dosage', e.target.value)} required />
                      <input type="text" placeholder="Duration" className="input-field" value={med.duration} onChange={(e) => handleMedChange(index, 'duration', e.target.value)} required />
                    </div>
                  ))}
                  
                  <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <label>Additional Notes</label>
                    <textarea className="textarea-field" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Advice to patient..."></textarea>
                  </div>
                </form>
              ) : (
                <form id="report-form" onSubmit={submitReport}>
                  <div className="form-group">
                    <label>Diagnosis</label>
                    <input type="text" className="input-field" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Tests to Recommend</label>
                    <input type="text" className="input-field" value={tests} onChange={(e) => setTests(e.target.value)} placeholder="CBC, X-Ray, etc." />
                  </div>
                  <div className="form-group">
                    <label>Doctor's Remarks</label>
                    <textarea className="textarea-field" value={remarks} onChange={(e) => setRemarks(e.target.value)}></textarea>
                  </div>
                </form>
              )}
            </div>
            
            <div className="modal-footer">
              <button onClick={closeForm} className="btn btn-outline" disabled={formLoading}>Cancel</button>
              <button 
                type="submit" 
                form={activeModal === 'prescription' ? 'presc-form' : 'report-form'} 
                className={activeModal === 'prescription' ? 'btn btn-primary' : 'btn btn-secondary'}
                disabled={formLoading}
              >
                {formLoading ? <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span> : <Save size={16} />} 
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayQueue;
