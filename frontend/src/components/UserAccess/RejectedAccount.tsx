import BlockIcon from "@mui/icons-material/BlockOutlined";
import { CardLayout } from "../../layouts";
import { Alert, Stack, Typography } from "@mui/material";

const RejectedAccount = () => {
  return (
    <CardLayout>
      <Stack direction="column" spacing={2} alignItems="center">
        <BlockIcon fontSize="large" />

        <Typography variant="h6">Tu solicitud fue rechazada</Typography>

        <Alert severity="error" sx={{ width: "100%" }}>
          <Typography variant="body2">
            Un administrador ha rechazado tu cuenta. Si tienes alguna pregunta,
            contacta con el administrador.
          </Typography>
        </Alert>
      </Stack>
    </CardLayout>
  );
};

export default RejectedAccount;
