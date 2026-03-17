import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const AppLayout = () => {
  return (
    <div className="app-layout" style={{ backgroundColor: 'var(--background)' }}>
      <Sidebar />
      <main className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div className="page-content" style={{ padding: '2rem', flex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
