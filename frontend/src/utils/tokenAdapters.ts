import {
  ICollectedToken,
  IProcessedToken,
  IRewardedToken,
  ITokenHistoryEntry,
  ITokenInfo,
  ITokenTransfer,
} from "../interfaces";

export function getUiTokenInfo(tokens: any[]): ITokenInfo[] {
  return tokens.map((token) => ({
    id: Number(token.id),
    creator: token.creator,
    currentHolder: token.currentHolder,
    name: token.name,
    totalSupply: Number(token.totalSupply),
    citizenFeatures: token.citizenFeatures,
    processorFeatures: token.processorFeatures,
    dateCreated: Number(token.dateCreated),
    stage: Number(token.stage),
  }));
}

export function getUiTokenHistoryEntry(
  entry: ITokenHistoryEntry
): ITokenHistoryEntry {
  return {
    id: Number(entry.id),
    previousHolder: entry.previousHolder,
    newHolder: entry.newHolder,
    action: Number(entry.action),
    timestamp: new Date(Number(entry.timestamp) * 1000).toLocaleString(),
  };
}

export function getUiTokenTransfer(transfer: any): ITokenTransfer {
  return {
    id: Number(transfer.id),
    tokenId: Number(transfer.tokenId),
    from: transfer.from,
    to: transfer.to,
    amount: Number(transfer.amount),
    status: Number(transfer.status),
    timestamp: Number(transfer.timestamp),
  };
}

export function getUiCollectedTokens(
  collectedTokens: any[]
): ICollectedToken[] {
  return collectedTokens.map((token: any) => {
    return {
      id: Number(token.id),
      address: token.transporter,
    };
  });
}

export function getUiProcessedToken(
  processedTokens: IProcessedToken[]
): IProcessedToken[] {
  return processedTokens.map((token: any) => {
    return {
      id: Number(token.id),
      processor: token.processor,
    };
  });
}

export const getUiRewardedToken = (
  rewardedTokens: IRewardedToken[]
): IRewardedToken[] => {
  return rewardedTokens.map((token: IRewardedToken) => ({
    id: Number(token.id),
    citizen: token.citizen,
    amount: Number(token.amount),
    authority: token.authority,
    rewardFeatures: token.rewardFeatures,
  }));
};
