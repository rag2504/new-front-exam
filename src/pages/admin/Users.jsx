import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users as UsersIcon, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'admin': return 'badge-danger';
      case 'doctor': return 'badge-primary';
      case 'receptionist': return 'badge-secondary';
      case 'patient': return 'badge-waiting';
      default: return 'badge-queued';
    }
  };

  if (loading) return <div className="loader-container"><div className="spinner"></div></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UsersIcon size={28} /> Manage Users
        </h2>
        <Link to="/admin/create-user" className="btn btn-primary" style={{ display: 'inline-flex' }}>
          <Plus size={18} /> Add New User
        </Link>
      </div>

      {error && <div className="alert alert-error"><span>{error}</span></div>}

      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ fontWeight: 500 }}>{user.name}</td>
                <td className="text-secondary">{user.email}</td>
                <td>
                  <span className={`badge`} style={{ 
                    backgroundColor: `var(--${getRoleBadgeColor(user.role).split('-')[1]}-light)`, 
                    color: `var(--${getRoleBadgeColor(user.role).split('-')[1]})`,
                    padding: '0.25rem 0.75rem' 
                  }}>
                    {user.role}
                  </span>
                </td>
                <td>Active</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '2rem' }}>
                  No users found in this clinic.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
