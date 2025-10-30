import React, { type FC, type PropsWithChildren } from "react";
import { useWalletState } from "./state";

type TMetamaskContext = ReturnType<typeof useWalletState>;

const MetamaskProviderContext = React.createContext<TMetamaskContext | null>(
  null
);

export const MetamaskProvider: FC<PropsWithChildren> = (props) => {
  const state = useWalletState();
  return <MetamaskProviderContext.Provider {...props} value={state} />;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWallet = () => {
  const context = React.useContext(MetamaskProviderContext);
  if (!context) {
    throw new Error("useWallet must be used within a MetamaskProvider");
  }
  return context;
};

export default MetamaskProvider;
