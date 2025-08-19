import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/Login";
import { JSX } from "react";

import { useAuth } from "../context/AuthContext";
import CustomerPainel from "../pages/CustomerPanel";

import ProfilePage from "../pages/Profile";
import AdminPage from "../pages/AdminPanel";
import AttendancePage from "../pages/AttendancesPanel";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

export default function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/attendances"
        element={
          <PrivateRoute>
            <AttendancePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <PrivateRoute>
            <CustomerPainel />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      {user?.role === "SELLER" && (
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>
          }
        />
      )}
    </Routes>
  );
}
