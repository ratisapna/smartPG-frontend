import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import PublicLayout from "./components/layout/PublicLayout";
import Home from "./pages/Home/Home";
import About from "./pages/Home/About";
import Contact from "./pages/Home/Contact";
import OwnerDashboard from "./pages/Dashboard/OwnerDashboard";
import TenantDashboard from "./pages/Dashboard/TenantDashboard";
import Tenants from "./pages/Dashboard/Tenants";
import Rooms from "./pages/Dashboard/Rooms";
import Complaints from "./pages/Dashboard/Complaints";
import Payments from "./pages/Dashboard/Payments";
import Inquiries from "./pages/Dashboard/Inquiries";
import Settings from "./pages/Dashboard/Settings";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import RoomDetails from "./pages/Rooms/RoomDetails";
import PGDetail from "./pages/PG/PGDetail";

// Role-based dashboard index
const DashboardIndex = () => {
  const role = localStorage.getItem("role") || JSON.parse(localStorage.getItem("user") || "{}").role || "TENANT";
  return role === "OWNER" ? <OwnerDashboard /> : <TenantDashboard />;
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />
      <Route
        path="/rooms/:roomId"
        element={
          <PublicLayout>
            <RoomDetails />
          </PublicLayout>
        }
      />
      <Route
        path="/pg/:pgId"
        element={
          <PublicLayout>
            <PGDetail />
          </PublicLayout>
        }
      />
      <Route
        path="/login"
        element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicLayout>
            <Signup />
          </PublicLayout>
        }
      />
      <Route
        path="/about"
        element={
          <PublicLayout>
            <About />
          </PublicLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <PublicLayout>
            <Contact />
          </PublicLayout>
        }
      />
      
      {/* Dashboard Routes with Layout */}
      <Route
        path="/dashboard/*"
        element={
          <DashboardLayout>
            <Routes>
              <Route index element={<DashboardIndex />} />
              <Route path="tenant" element={<TenantDashboard />} />
              <Route path="tenants" element={<Tenants />} />
              <Route path="rooms" element={<Rooms />} />
              <Route path="complaints" element={<Complaints />} />
              <Route path="payments" element={<Payments />} />
              <Route path="inquiries" element={<Inquiries />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </DashboardLayout>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
