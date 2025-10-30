import { useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import { Button } from "@mui/material";

import { useGlobal } from "@context/global/provider";
import { UserRole } from "../../interfaces";

const RoleButtons = () => {
  const { userInfo } = useGlobal();
  const navigate = useNavigate();

  function handleNavigateToAdminPanel() {
    navigate("/admin-panel");
  }

  function handleNavigateDashboard() {
    navigate("/dashboard");
  }

  if (userInfo?.role !== UserRole.ADMIN) {
    return (
      <Button startIcon={<DashboardIcon />} onClick={handleNavigateDashboard}>
        Dashboard
      </Button>
    );
  }

  if (userInfo?.role === UserRole.ADMIN) {
    return (
      <Button
        startIcon={<AdminPanelSettingsIcon />}
        onClick={handleNavigateToAdminPanel}
      >
        Admin Panel
      </Button>
    );
  }

  return null;
};

export default RoleButtons;
