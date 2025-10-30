import { useMemo } from "react";

import { useWallet } from "@context/metamask/provider";

import { useContractInstance } from "./useContracts";
import {
  ContractNames,
  IRewardedToken,
  ITokenInfo,
  ITokenTransfer,
  TransferStatus,
} from "../interfaces";
import { traceabilityServices } from "../services/traceabilityServices";

export const useTraceability = () => {
  const { account } = useWallet();
  const contract = useContractInstance(ContractNames.TRACEABILITY);

  const service = useMemo(
    () => (contract ? traceabilityServices(contract) : null),
    [contract]
  );

  const isServiceReady = !!service && !!account;

  function getTokensByUser() {
    if (!service || !account) return [];
    const tokens = service.getTokensByUser(account);
    return tokens;
  }

  async function getAllTokens() {
    if (!service || !account) return [];
    return service.getAllTokens();
  }

  function createToken(
    name: string,
    totalSupply: number,
    citizenFeatures: string,
    parentId: number = 0
  ): Promise<void> {
    if (!service) return Promise.resolve();
    return service.createToken(name, totalSupply, citizenFeatures, parentId);
  }

  function getTokenHistory(tokenId: number) {
    if (!service) return Promise.resolve([]);
    return service.getTokenHistory(tokenId);
  }

  function collectToken(tokenId: number): Promise<void> {
    if (!service) return Promise.resolve();
    return service.collectToken(tokenId);
  }

  function transfer(
    tokenId: number,
    to: string,
    amount: number
  ): Promise<void> {
    if (!service) return Promise.resolve();
    return service.transfer(tokenId, to, amount);
  }

  function getTransfers(status?: TransferStatus): Promise<ITokenTransfer[]> {
    if (!service) return Promise.resolve([]);
    return service.getTransfers(status);
  }

  function acceptTransfer(transferId: number) {
    if (!service) return Promise.resolve();
    return service.acceptTransfer(transferId);
  }

  function rejectTransfer(transferId: number) {
    if (!service) return Promise.resolve();
    return service.rejectTransfer(transferId);
  }

  function processToken(tokenId: number, features: string) {
    if (!service) return Promise.resolve();
    return service.processToken(tokenId, features);
  }

  function rewardToken(
    tokenId: number,
    amount: number,
    rewardFeatures: string
  ) {
    if (!service) return Promise.resolve();
    return service.rewardToken(tokenId, amount, rewardFeatures);
  }

  function getRewardedTokens(): Promise<IRewardedToken[]> {
    if (!service) return Promise.resolve([]);
    return service.getRewardedTokens();
  }

  function getCollectedTokens(): Promise<ITokenInfo[]> {
    if (!service) return Promise.resolve([]);
    return service.getCollectedTokens();
  }

  async function getRewardedTokensByUser(
    account: string
  ): Promise<IRewardedToken[]> {
    const rewardedTokens = await getRewardedTokens();
    return rewardedTokens.filter(
      (t) => t.citizen.toLowerCase() === account.toLowerCase()
    );
  }

  async function getProcessedTokens(): Promise<ITokenInfo[]> {
    if (!service) return Promise.resolve([]);
    return service.getProcessedTokens();
  }

  return {
    acceptTransfer,
    collectToken,
    createToken,
    getAllTokens,
    getCollectedTokens,
    getProcessedTokens,
    getRewardedTokens,
    getRewardedTokensByUser,
    getTokenHistory,
    getTokensByUser,
    getTransfers,
    isServiceReady,
    processToken,
    rejectTransfer,
    rewardToken,
    service,
    transfer,
  };
};
