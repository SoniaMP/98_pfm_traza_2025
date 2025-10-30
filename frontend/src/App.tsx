import { Routes, Route, Navigate } from "react-router-dom";

import RequestRole from "@components/UserAccess/RequestRole";
import Login from "@components/UserAccess/Login";
import DashboardRouter from "@components/Dashboard";
import RouteLayout from "./layout/RouteLayout";
import AdminPanel from "@components/Admin";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<RouteLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="request-role" element={<RequestRole />} />
          <Route path="dashboard" element={<DashboardRouter />} />
          <Route path="admin-panel" element={<AdminPanel />} />
          <Route path="roles" element={<div>Roles page ...</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
