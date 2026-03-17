import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout
import AppLayout from './layouts/AppLayout';

// Public Pages
import Login from './pages/Login';

// Shared Pages
import Dashboard from './pages/Dashboard';

// Admin Pages
import ClinicInfo from './pages/admin/ClinicInfo';
import Users from './pages/admin/Users';
import CreateUser from './pages/admin/CreateUser';

// Patient Pages
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import AppointmentDetails from './pages/patient/AppointmentDetails';
import Prescriptions from './pages/patient/Prescriptions';
import Reports from './pages/patient/Reports';

// Receptionist Pages
import DailyQueue from './pages/receptionist/DailyQueue';

// Doctor Pages
import TodayQueue from './pages/doctor/TodayQueue';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes inside AppLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/clinic" element={<ClinicInfo />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/create-user" element={<CreateUser />} />
              </Route>

              {/* Patient Routes */}
              <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
                <Route path="/patient/book" element={<BookAppointment />} />
                <Route path="/patient/appointments" element={<MyAppointments />} />
                <Route path="/patient/appointments/:id" element={<AppointmentDetails />} />
                <Route path="/patient/prescriptions" element={<Prescriptions />} />
                <Route path="/patient/reports" element={<Reports />} />
              </Route>

              {/* Receptionist Routes */}
              <Route element={<ProtectedRoute allowedRoles={['receptionist']} />}>
                <Route path="/receptionist/queue" element={<DailyQueue />} />
              </Route>

              {/* Doctor Routes */}
              <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
                <Route path="/doctor/queue" element={<TodayQueue />} />
              </Route>
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
