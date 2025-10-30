import { getUiAccountsList, ROLES } from "@utils/accessAdapters";
import { IAccountInfo } from "interfaces";

export const accessManagerServices = (contract: any) => {
  if (!contract) {
    console.warn("AccessManager contract not initialized");
  }

  async function getAccountInfo(account: string): Promise<IAccountInfo> {
    const info = await contract.getAccountInfo(account);
    return {
      account: info[0],
      role: info[1],
      status: Number(info[2]),
    };
  }

  async function requestRole(role: string): Promise<void> {
    const hashRole = ROLES[role as keyof typeof ROLES];
    if (!hashRole) {
      throw new Error(`Invalid role name: ${role}`);
    }

    try {
      const tx = await contract.requestRole(hashRole);

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        return;
      } else {
        throw new Error("Transaction failed (status 0)");
      }
    } catch (err: any) {
      throw new Error(err?.reason || err?.message || "Transaction reverted");
    }
  }

  async function approveAccount(account: string): Promise<void> {
    try {
      const tx = await contract.approveAccount(account);
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        return;
      } else {
        throw new Error("Transaction failed (status 0)");
      }
    } catch (err: any) {
      throw new Error(err?.reason || err?.message || "Transaction reverted");
    }
  }

  async function rejectAccount(account: string): Promise<void> {
    try {
      const tx = await contract.rejectAccount(account);
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        return;
      } else {
        throw new Error("Transaction failed (status 0)");
      }
    } catch (err: any) {
      throw new Error(err?.reason || err?.message || "Transaction reverted");
    }
  }

  async function getAllAccounts(): Promise<IAccountInfo[]> {
    try {
      const tx = await contract.getAllAccounts();
      return getUiAccountsList(tx);
    } catch (err: any) {
      throw new Error(err?.reason || err?.message || "Transaction reverted");
    }
  }

  return {
    getAccountInfo,
    requestRole,
    approveAccount,
    rejectAccount,
    getAllAccounts,
  };
};
