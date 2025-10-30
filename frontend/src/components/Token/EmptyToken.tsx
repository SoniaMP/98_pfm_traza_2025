import { Box, Button, Card, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const EmptyToken = ({ onAddToken }: { onAddToken: () => void }) => {
  return (
    <Card sx={{ p: 2 }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="body1" fontWeight={600}>
          ¿Qué hace este sistema?
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Convierte activos físicos en tokens digitales únicos para poder
          rastrear su origen, estado y transferencias. Cada token guarda
          metadatos (cantidad, fecha, características) y avanza por etapas
          (creado, recompensado, etc.), permitiendo trazabilidad segura e
          inmutable mediante la capa de servicios.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Crea tu primer token para comenzar a registrar y gestionar activos con
          un flujo moderno y transparente.
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddToken}
          >
            Crear primer token
          </Button>
        </Box>
      </Stack>
    </Card>
  );
};

export default EmptyToken;
