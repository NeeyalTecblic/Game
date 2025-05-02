import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Register, EmailVerification, AdminLogin } from './pages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register/customer" element={<Register role="customer" />} />
        <Route path="/register/admin" element={<Register role="admin" />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="*" element={<Navigate to="/register/customer" />} />
      </Routes>
    </Router>
  );
}

export default App;
