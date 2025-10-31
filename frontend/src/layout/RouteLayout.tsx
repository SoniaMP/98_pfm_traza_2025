import { Navigate, Outlet } from "react-router-dom";

import Header from "@components/Header";
import { useWallet } from "@context/metamask/provider";
import { useGlobal } from "@context/global/provider";
import { UserRole } from "../interfaces";
import LoadingOverlay from "./LoadingOverlay";

const RouteLayout = () => {
  const { account } = useWallet();
  const { userInfo, isServiceReady, isUserInfoLoading } = useGlobal();

  if (!account) {
    return <Navigate to="/app/login" replace />;
  }

  if (!isServiceReady || isUserInfoLoading) {
    return <LoadingOverlay loading={true} />;
  }

  if (!userInfo && location.pathname !== "/app/request-role") {
    return <Navigate to="/app/request-role" replace />;
  }

  if (
    location.pathname.startsWith("/admin-panel") &&
    userInfo?.role !== UserRole.ADMIN
  ) {
    console.warn("🔒 Usuario no autorizado. Redirigiendo a /dashboard");
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default RouteLayout;
