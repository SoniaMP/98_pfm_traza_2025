import { ethers } from "ethers";
import { UserRole, type IAccountInfo } from "../interfaces";

// --- Roles definidos en el contrato (hashes de keccak256) ---
export const ROLES: Record<string, string> = {
  [UserRole.ADMIN]: ethers.keccak256(ethers.toUtf8Bytes(UserRole.ADMIN)),
  [UserRole.CITIZEN]: ethers.keccak256(ethers.toUtf8Bytes(UserRole.CITIZEN)),
  [UserRole.TRANSPORTER]: ethers.keccak256(
    ethers.toUtf8Bytes(UserRole.TRANSPORTER)
  ),
  [UserRole.PROCESSOR]: ethers.keccak256(
    ethers.toUtf8Bytes(UserRole.PROCESSOR)
  ),
  [UserRole.REWARD_AUTHORITY]: ethers.keccak256(
    ethers.toUtf8Bytes(UserRole.REWARD_AUTHORITY)
  ),
} as const;

// --- Mapa inverso para decodificar desde la blockchain ---
export const ROLE_NAMES: Record<string, string> = Object.entries(ROLES).reduce(
  (acc, [name, hash]) => {
    acc[hash] = name;
    return acc;
  },
  {} as Record<string, string>
);

// --- Decodificador desde contrato → front ---
export function getUiAccountInfo(
  accountInfo: IAccountInfo
): IAccountInfo | null {
  const { account, role, status } = accountInfo;

  const newRole = ROLE_NAMES[role];
  if (!newRole) return null;

  return { account, role: newRole, status: Number(status) };
}

export function getUiAccountsList(accounts: any): IAccountInfo[] {
  return accounts
    .map((acc: any) => getUiAccountInfo(acc))
    .filter(Boolean) as IAccountInfo[];
}

// --- Codificador desde front → contrato ---
export function encodeRole(roleName: keyof typeof ROLES): string {
  const role = ROLES[roleName];
  if (!role) throw new Error(`Invalid role name: ${roleName}`);
  return role;
}
