import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { getAuthToken, getStoredUser } from '../../lib/auth';

const ProtectedAdminRoute = () => {
  const location = useLocation();
  const token = getAuthToken();
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
