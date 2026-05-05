import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export function DashboardRedirect() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) return <Navigate to="/login" replace />;

  if (user.role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/user/dashboard" replace />;
}

export function ProtectedRoute() {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function AdminProtected() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
