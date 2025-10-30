import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Stack,
  Tooltip,
} from "@mui/material";
import AccountIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import RecycleIcon from "@mui/icons-material/RecyclingOutlined";

import { useGlobal } from "@context/global/provider";
import { useWallet } from "@context/metamask/provider";
import { HeaderChip } from "../styled";
import { formatAddress } from "../../utils/helpers";
import RoleButtons from "./RoleButtons";
import { mapRoleToLabel } from "../../interfaces";

const HeaderButtons = () => {
  const {
    account,
    isConnecting,
    isMetamaskInstalled,
    connectWallet,
    disconnectWallet,
  } = useWallet();
  const { userInfo } = useGlobal();

  return (
    isMetamaskInstalled && (
      <>
        {account ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <Stack spacing={0.5} direction="row" alignItems="center">
              <AccountIcon />
              {userInfo.role && (
                <Typography variant="caption">
                  {mapRoleToLabel[userInfo.role]}
                </Typography>
              )}
            </Stack>
            <Tooltip title={account} arrow>
              <HeaderChip
                label={formatAddress(account)}
                size="medium"
                variant="outlined"
              />
            </Tooltip>
            <RoleButtons />
            <Button
              variant="outlined"
              color="inherit"
              onClick={disconnectWallet}
              startIcon={<LogoutIcon />}
            >
              Cerrar sesión
            </Button>
          </Stack>
        ) : (
          <Button
            onClick={connectWallet}
            loading={isConnecting}
            startIcon={<WalletIcon />}
          >
            {isConnecting ? "Conectando..." : "Conectar Wallet"}
          </Button>
        )}
      </>
    )
  );
};

const Header = () => {
  const { userInfo } = useGlobal();

  return (
    <AppBar position="static">
      <Toolbar>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          <RecycleIcon />
          <Stack spacing={1} direction="row" alignItems="center">
            <Typography variant="h6">EcoTrack</Typography>
            <Stack>
              <Typography variant="body2">
                Solución Ecológica aplicada a la cadena de suministro.
              </Typography>
              <Typography variant="caption">
                Recicla: Tu huella verde, nuestro futuro.
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {userInfo && <HeaderButtons />}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
