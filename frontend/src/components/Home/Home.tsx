import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import RecyclingIcon from "@mui/icons-material/Autorenew";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import TimelineIcon from "@mui/icons-material/Timeline";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f4f7 0%, #dceefb 100%)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: "center", py: 6 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          ♻️ EcoTrack - Recycling Traceability
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4}>
          Transparencia y trazabilidad completa en el reciclaje gracias a la
          tecnología blockchain.
        </Typography>

        <Box sx={{ mb: 6 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/login")}
            sx={{ mr: 2 }}
          >
            Abrir DApp
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            href="https://github.com/SoniaMP/98_pfm_traza_2025"
            target="_blank"
          >
            Ver código
          </Button>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <RecyclingIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6" fontWeight={600} mt={2}>
                  Flujo completo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Desde el ciudadano hasta la autoridad, cada paso queda
                  registrado en la blockchain.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <VerifiedUserIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6" fontWeight={600} mt={2}>
                  Roles seguros
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sistema de permisos basado en roles y verificación con
                  AccessControl de OpenZeppelin.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <TimelineIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6" fontWeight={600} mt={2}>
                  Trazabilidad real
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cada cambio de estado o propietario se registra con eventos
                  on-chain.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Footer */}
        <Typography variant="body2" color="text.secondary" mt={6}>
          Proyecto desarrollado por <strong>Sonia Molina</strong> — 2025
        </Typography>
      </Container>
    </Box>
  );
}
