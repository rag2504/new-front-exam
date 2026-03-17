import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { ListOrdered, CheckCircle, RefreshCcw, SkipForward, PlayCircle } from 'lucide-react';

const DailyQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchQueue();
  }, [date]);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/queue?date=${date}`);
      setQueue(data);
    } catch (err) {
      setError('Failed to fetch daily queue');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    setUpdating(id);
    try {
      await api.patch(`/queue/${id}`, { status: newStatus.replace('_', '-') });
      
      // Update local state
      setQueue(queue.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      ));
    } catch (err) {
      let errorMsg = 'Failed to update status';
      if (err.response?.data?.error) errorMsg = err.response.data.error;
      else if (err.response?.data?.message) errorMsg = err.response.data.message;
      else if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) errorMsg = err.response.data.detail.map(d => `${d.loc ? d.loc.join('.') : 'field'}: ${d.msg}`).join(', ');
        else errorMsg = err.response.data.detail;
      }
      alert(errorMsg);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'waiting': return 'badge-waiting';
      case 'in_progress': return 'badge-in_progress';
      case 'done': return 'badge-done';
      case 'skipped': return 'badge-skipped';
      default: return 'badge-queued';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ListOrdered size={28} className="text-primary" /> Daily Queue
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label htmlFor="queue-date" style={{ margin: 0 }}>Date:</label>
          <input
            type="date"
            id="queue-date"
            className="input-field"
            style={{ width: 'auto' }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button onClick={fetchQueue} className="btn btn-outline btn-icon-only">
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error"><span>{error}</span></div>}

      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Patient Details</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}>
                  <div className="spinner" style={{ margin: '0 auto' }}></div>
                </td>
              </tr>
            ) : queue.length > 0 ? (
              queue.map((item) => (
                <tr key={item.id} style={{ opacity: updating === item.id ? 0.6 : 1 }}>
                  <td>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                      #{item.tokenNumber}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600 }}>{item.appointment?.patient?.name || item.patientName || 'Unknown Patient'}</span>
                      <span className="text-secondary" style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                        Ref: #{String(item.appointmentId).padStart(4, '0')}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeColor(item.status)}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {item.status === 'waiting' && (
                        <>
                          <button 
                            className="btn btn-primary btn-icon-only" 
                            title="Start Progress"
                            onClick={() => updateStatus(item.id, 'in_progress')}
                            disabled={updating === item.id}
                          >
                            <PlayCircle size={18} />
                          </button>
                          <button 
                            className="btn btn-danger btn-icon-only" 
                            title="Skip Patient"
                            onClick={() => updateStatus(item.id, 'skipped')}
                            disabled={updating === item.id}
                          >
                            <SkipForward size={18} />
                          </button>
                        </>
                      )}
                      
                      {item.status === 'in_progress' && (
                        <button 
                          className="btn btn-secondary btn-icon-only" 
                          title="Mark Done"
                          onClick={() => updateStatus(item.id, 'done')}
                          disabled={updating === item.id}
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      
                      {(item.status === 'done' || item.status === 'skipped') && (
                        <span className="text-tertiary" style={{ fontSize: '0.875rem' }}>Completed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
                  No appointments found for the selected date.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyQueue;
