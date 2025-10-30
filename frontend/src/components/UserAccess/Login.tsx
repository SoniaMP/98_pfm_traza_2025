import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  Button,
  Stack,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ShieldOk from "@mui/icons-material/GppGoodOutlined";
import HubIcon from "@mui/icons-material/HubOutlined";
import LockIcon from "@mui/icons-material/LockOpenOutlined";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";

import { useWallet } from "../../context/metamask/provider";
import { CardLayout } from "../../layouts";

const Login = () => {
  const { account, isMetamaskInstalled, connectWallet } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (account) {
      navigate("/");
    }
  }, [account, navigate]);

  return (
    <CardLayout>
      <Stack direction="column" spacing={2} alignItems="center">
        <WalletIcon />
        <Typography variant="h5" gutterBottom>
          Conecta tu cuenta
        </Typography>
        <Typography variant="body1">
          Conecta con MetaMask para acceder al portal y gestionar la cadena de
          suministro.
        </Typography>
        <Button
          startIcon={<WalletIcon />}
          disabled={!isMetamaskInstalled}
          onClick={connectWallet}
        >
          Conecta con MetaMask
        </Button>

        {!isMetamaskInstalled && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">
              ¿No tienes MetaMask instalado?
            </Typography>
            <Link
              href="https://metamask.io/download.html"
              target="_blank"
              variant="body2"
              rel="noopener noreferrer"
            >
              Descarga MetaMask aquí
            </Link>
          </Stack>
        )}
        <Card sx={{ p: 2 }}>
          <Typography variant="body1" fontWeight={"bold"}>
            ¿Por qué usar tu wallet?
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <ShieldOk />
              </ListItemIcon>
              <ListItemText
                primary="Seguridad"
                secondary="Tu wallet es la forma más segura de gestionar tus activos."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <HubIcon />
              </ListItemIcon>
              <ListItemText
                primary="Descentralización"
                secondary="Controla tus datos y transacciones sin intermediarios."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LockIcon />
              </ListItemIcon>
              <ListItemText
                primary="Control total"
                secondary="Eres el único dueño de tus activos y decisiones."
              />
            </ListItem>
          </List>
        </Card>
      </Stack>
    </CardLayout>
  );
};

export default Login;
