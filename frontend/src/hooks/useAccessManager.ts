import useSWR from "swr";
import { useEffect, useMemo } from "react";

import { useWallet } from "@context/metamask/provider";
import { getUiAccountInfo } from "@utils/accessAdapters";

import { accessManagerServices } from "../services/accessManagerServices";
import { useContractInstance } from "./useContracts";
import { ContractNames } from "../interfaces";

export const useAccessManager = () => {
  const { account } = useWallet();
  const contract = useContractInstance(ContractNames.ACCESS_MANAGER);

  const service = useMemo(
    () => (contract ? accessManagerServices(contract) : null),
    [contract]
  );

  const isServiceReady = !!service && !!account;

  const fallback = (() => {
    try {
      const cached = localStorage.getItem("userInfo");
      return cached ? JSON.parse(cached) : undefined;
    } catch {
      return undefined;
    }
  })();

  const {
    data,
    error,
    isLoading: isFetching,
    mutate: reloadUserInfo,
  } = useSWR(
    isServiceReady ? ["accountInfo", account] : null,
    () => service!.getAccountInfo(account as string),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      fallbackData: fallback,
    }
  );

  function getUserInfo(data: any) {
    if (!data) return null;

    const isFromStorage = !!fallback && data === fallback;
    return isFromStorage ? data : getUiAccountInfo(data);
  }

  const isUserInfoLoading = !data && !error && isFetching;
  const userInfo = getUserInfo(data);

  const getAllAccounts = async () => {
    if (!service) return [];
    return service.getAllAccounts();
  };

  useEffect(() => {
    if (userInfo) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
  }, [userInfo]);

  useEffect(() => {
    if (!account) {
      localStorage.removeItem("userInfo");
    }
  }, [account]);

  return {
    userInfo,
    isUserInfoLoading,
    isServiceReady,
    error,
    reloadUserInfo,
    requestRole: service?.requestRole,
    approveAccount: service?.approveAccount,
    rejectAccount: service?.rejectAccount,
    getAllAccounts,
    getAccountInfo: service?.getAccountInfo,
  };
};
