export enum ContractNames {
  ACCESS_MANAGER = "AccessManager",
  TRACEABILITY = "Traceability",
}

export const enum UserRole {
  ADMIN = "ADMIN",
  CITIZEN = "CITIZEN",
  TRANSPORTER = "TRANSPORTER",
  PROCESSOR = "PROCESSOR",
  REWARD_AUTHORITY = "REWARD_AUTHORITY",
}

export enum TokenStage {
  None,
  Created,
  Collected,
  Processed,
  Rewarded,
}

export enum AccountStatus {
  None,
  Pending,
  Approved,
  Rejected,
  Canceled,
}

export enum TransferStatus {
  None,
  Pending,
  Accepted,
  Rejected,
}

export const mapRoleToLabel: Record<string, string> = {
  ADMIN: "Admin",
  CITIZEN: "Ciudadano",
  TRANSPORTER: "Transportista",
  PROCESSOR: "Procesador",
  REWARD_AUTHORITY: "Autoridad Reguladora",
};

export const mapTransferStatusToLabel: Record<TransferStatus, string> = {
  [TransferStatus.None]: "Ninguno",
  [TransferStatus.Pending]: "Pendiente",
  [TransferStatus.Accepted]: "Aceptado",
  [TransferStatus.Rejected]: "Rechazado",
};

export const mapStatusToLabel: Record<AccountStatus, string> = {
  [AccountStatus.None]: "Sin solicitud",
  [AccountStatus.Pending]: "En revisión",
  [AccountStatus.Approved]: "Aprobado",
  [AccountStatus.Rejected]: "Rechazado",
  [AccountStatus.Canceled]: "Cancelado",
};

export const mapTokenStageToLabel: Record<TokenStage, string> = {
  [TokenStage.None]: "Ninguno",
  [TokenStage.Created]: "Creado",
  [TokenStage.Collected]: "Recogido",
  [TokenStage.Processed]: "Procesado",
  [TokenStage.Rewarded]: "Recompensado",
};

export interface IAccountInfo {
  account: string;
  role: string;
  status: AccountStatus;
}

export interface ITokenInfo {
  id: number;
  creator: string;
  currentHolder: string;
  name: string;
  totalSupply: number;
  citizenFeatures: string;
  processorFeatures: string;
  dateCreated: number;
  stage: TokenStage;
}

export interface ICollectedToken {
  id: number;
  address: string;
}

export interface IProcessedToken {
  id: number;
  processor: string;
}

export interface IRewardedToken {
  id: number;
  citizen: string;
  amount: number;
  authority: string;
  rewardFeatures: string;
}

export interface INewTokenForm {
  name: string;
  total: number;
  additionalInfo: string;
}

export interface ITokenHistoryEntry {
  id: number;
  newHolder: string;
  previousHolder: string;
  action: TokenStage;
  timestamp: string;
}

export interface ITokenTransfer {
  id: number;
  tokenId: number;
  from: string;
  to: string;
  amount: number;
  status: TransferStatus;
  timestamp: number;
}
