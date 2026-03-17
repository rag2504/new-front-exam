import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


import AppLayout from './layouts/AppLayout';

import Login from './pages/Login';


import Dashboard from './pages/Dashboard';

import ClinicInfo from './pages/admin/ClinicInfo';
import Users from './pages/admin/Users';
import CreateUser from './pages/admin/CreateUser';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import AppointmentDetails from './pages/patient/AppointmentDetails';
import Prescriptions from './pages/patient/Prescriptions';
import Reports from './pages/patient/Reports';
import DailyQueue from './pages/receptionist/DailyQueue';

import TodayQueue from './pages/doctor/TodayQueue';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

        
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
             
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/clinic" element={<ClinicInfo />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/create-user" element={<CreateUser />} />
              </Route>

            
              <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
                <Route path="/patient/book" element={<BookAppointment />} />
                <Route path="/patient/appointments" element={<MyAppointments />} />
                <Route path="/patient/appointments/:id" element={<AppointmentDetails />} />
                <Route path="/patient/prescriptions" element={<Prescriptions />} />
                <Route path="/patient/reports" element={<Reports />} />
              </Route>

             
              <Route element={<ProtectedRoute allowedRoles={['receptionist']} />}>
                <Route path="/receptionist/queue" element={<DailyQueue />} />
              </Route>

           
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
