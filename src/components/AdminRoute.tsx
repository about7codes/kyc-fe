import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { user, token } = useSelector((state: any) => state.auth);

  if (!token || user?.role !== "Admin") {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default AdminRoute;
