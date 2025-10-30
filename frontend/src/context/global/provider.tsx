import React, { type FC, type PropsWithChildren } from "react";
import { useGlobalState } from "./state";

type TGlobalState = ReturnType<typeof useGlobalState>;

const GlobalContext = React.createContext<TGlobalState | null>(null);

export const GlobalProvider: FC<PropsWithChildren> = (props) => {
  const state = useGlobalState();
  return <GlobalContext.Provider {...props} value={state} />;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGlobal = () => {
  const context = React.useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
};

export default GlobalProvider;
