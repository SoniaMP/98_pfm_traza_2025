import { useEffect } from "react";
import { useAccessManager } from "../../hooks/useAccessManager";

export const useGlobalState = () => {
  const {
    userInfo,
    isServiceReady,
    isUserInfoLoading,
    requestRole,
    approveAccount,
  } = useAccessManager();

  useEffect(() => {
    if (userInfo) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
  }, [userInfo]);

  return {
    userInfo,
    isServiceReady,
    isUserInfoLoading,
    requestRole,
    approveAccount,
  };
};
