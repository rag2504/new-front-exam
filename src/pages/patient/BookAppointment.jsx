import React, { useState } from 'react';
import api from '../../services/api';
import { CalendarPlus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:00-10:30'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const timeSlots = [
    '09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00', '11:00-11:30', '11:30-12:00',
    '14:00-14:30', '14:30-15:00', '15:00-15:30', '15:30-16:00', '16:00-16:30', '16:30-17:00'
  ];

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formattedDate = formData.date.split("T")[0];
      const payload = {
        appointmentDate: formattedDate,
        timeSlot: formData.timeSlot
      };
      
      console.log("Appointment payload:", payload);

      await api.post("/appointments", payload);
      
      setSuccess('Appointment booked successfully. You will be redirected shortly.');
      setTimeout(() => {
        navigate('/patient/appointments');
      }, 2000);
    } catch (err) {
      console.error('Booking error:', err);
      console.error('Response data:', err.response?.data);
      
      let errorMsg = 'Failed to book appointment.';
      if (err.response?.data) {
        if (Array.isArray(err.response.data.detail)) {
          errorMsg = err.response.data.detail.map(d => `${d.loc ? d.loc.join('.') : 'field'}: ${d.msg}`).join(', ');
        } else if (typeof err.response.data.detail === 'string') {
          errorMsg = err.response.data.detail;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        } else if (err.response.data.error) {
          errorMsg = err.response.data.error;
        } else if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else {
          errorMsg = JSON.stringify(err.response.data);
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <CalendarPlus size={28} /> Book Appointment
      </h2>

      <div className="card glass-panel" style={{ maxWidth: '600px' }}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              className="input-field"
              value={formData.date}
              onChange={handleChange}
              min={getMinDate()}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label htmlFor="timeSlot">Time Slot</label>
            <select
              id="timeSlot"
              name="timeSlot"
              className="select-field"
              value={formData.timeSlot}
              onChange={handleChange}
              required
            >
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            <p className="form-error" style={{ color: 'var(--text-tertiary)' }}>
              Selected slots are subject to availability. Only one patient is prioritized per slot.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span> : <ArrowRight size={18} />}
              <span>Confirm Booking</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
