import WarningIcon from "@mui/icons-material/WarningAmberOutlined";

import { CardLayout } from "../../layouts";
import { Alert, Stack, Typography } from "@mui/material";

const UnderRevision = () => {
  return (
    <CardLayout>
      <Stack direction="column" spacing={2} alignItems="center">
        <WarningIcon fontSize="large" />

        <Typography variant="h6">Tu solicitud está en revisión</Typography>

        <Alert severity="warning" sx={{ width: "100%" }}>
          <Typography variant="body2">
            Un administrador está revisando tu solicitud. Si tienes alguna
            pregunta, contacta con el administrador.
          </Typography>
          <Typography variant="caption">
            (Puede tardar hasta 24 horas en procesarse)
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Gracias por tu paciencia.
          </Typography>
        </Alert>
      </Stack>
    </CardLayout>
  );
};

export default UnderRevision;
