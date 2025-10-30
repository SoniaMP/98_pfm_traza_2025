import { useState } from "react";
import LockIcon from "@mui/icons-material/LockOpenOutlined";
import ArrowRight from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useAccessManager } from "@hooks/useAccessManager";
import { CardLayout } from "../../layouts";
import { UserRole } from "../../interfaces";

const RequestRole = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { requestRole, reloadUserInfo } = useAccessManager();

  async function handleRequestRole() {
    try {
      setIsLoading(true);
      await requestRole?.(role!);
      await reloadUserInfo?.();
      navigate("/dashboard");
    } catch (err) {
      alert(`Error al solicitar el rol: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CardLayout>
      <Stack direction="column" spacing={2} alignItems="center">
        <LockIcon />

        <Typography variant="h5" gutterBottom>
          Registra tu acceso
        </Typography>

        <Stack>
          <Typography variant="body1">
            Selecciona tu rol en la cadena de suministro
          </Typography>
          <Typography variant="caption">
            El administrador del sistema revisará tu solicitud
          </Typography>
        </Stack>

        <Select
          fullWidth
          value={role}
          sx={{ padding: 0 }}
          onChange={(e) => setRole(e.target.value as UserRole)}
        >
          <MenuItem value={UserRole.CITIZEN}>Ciudadano</MenuItem>
          <MenuItem value={UserRole.TRANSPORTER}>Transportista</MenuItem>
          <MenuItem value={UserRole.PROCESSOR}>Procesador</MenuItem>
          <MenuItem value={UserRole.REWARD_AUTHORITY}>Regulador</MenuItem>
        </Select>

        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            textAlign: "justify",
            backgroundColor: (theme) => theme.palette.grey[100],
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" color="textSecondary" align="center">
            Descripción roles
          </Typography>
          <Typography variant="body2">
            <strong>Ciudadano:</strong> Recolecta y deposita productos para su
            reciclaje.
          </Typography>
          <Typography variant="body2">
            <strong>Transportista:</strong> Se encarga del traslado de productos
            reciclables entre ciudadanos, puntos de recolección y centros de
            procesamiento.
          </Typography>
          <Typography variant="body2">
            <strong>Procesador:</strong> Recibe productos reciclables y los
            transforma en materiales reutilizables.
          </Typography>
          <Typography variant="body2">
            <strong>Autoridad Reguladora:</strong> Organización gubernamental o
            comunitaria que supervisa y regula las actividades de reciclaje en
            su jurisdicción. Es responsable de premiar a los ciudadanos que
            reciclan correctamente.
          </Typography>
        </Box>

        <Button
          disabled={!role}
          fullWidth
          loading={isLoading}
          startIcon={<ArrowRight />}
          onClick={handleRequestRole}
        >
          Solicitar acceso
        </Button>
      </Stack>
    </CardLayout>
  );
};

export default RequestRole;
