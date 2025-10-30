import { useWallet } from "@context/metamask/provider";
import { ethers } from "ethers";
import AccessManagerAbi from "../abis/AccessManager.json";
import TraceabilityAbi from "../abis/Traceability.json";
import { useEffect, useState } from "react";

const CONTRACTS = {
  AccessManager: {
    address: import.meta.env.VITE_ACCESS_MANAGER_ADDRESS,
    abi: AccessManagerAbi,
  },
  Traceability: {
    address: import.meta.env.VITE_TRACEABILITY_ADDRESS,
    abi: TraceabilityAbi,
  },
};

function getContractInstance(
  address: string,
  abi: any,
  signer: ethers.Signer | null
): ethers.Contract | null {
  if (!signer || !address) return null;
  return new ethers.Contract(address, abi, signer);
}

export const useContractInstance = (name: keyof typeof CONTRACTS) => {
  const { signer } = useWallet();
  const { address, abi } = CONTRACTS[name];
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (!signer || !address) return;

    const instance = getContractInstance(address, abi, signer);
    setContract(instance);
  }, [address, abi, signer]);

  return contract;
};
