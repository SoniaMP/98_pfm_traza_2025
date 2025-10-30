import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PropaneIcon from "@mui/icons-material/PropaneTankOutlined";

import { mapRoleToLabel, UserRole } from "../../interfaces";

type CreateTokenProps = {
  open: boolean;
  role: UserRole;
  onClose: () => void;
  onCreate: (token: {
    name: string;
    total: number;
    additionalInfo: string;
  }) => void;
};

const AdditionalInfo = ({ role }: { role: UserRole }) => {
  return (
    <Alert severity="info">
      <Typography variant="subtitle1" gutterBottom>
        Creando un token como {mapRoleToLabel[role]}:
      </Typography>
      {role === UserRole.CITIZEN &&
        "Como ciudadano, puedes incluir información relevante sobre el material reciclable que estás tokenizando."}
      {role === UserRole.TRANSPORTER &&
        "Como transportista, puedes incluir detalles específicos sobre el proceso de transporte o características del material."}
      {role === UserRole.PROCESSOR &&
        "Como procesador, puedes agregar información sobre cómo se utilizará el material reciclado en la producción de nuevos productos."}
    </Alert>
  );
};

const CreateToken = ({ open, role, onClose, onCreate }: CreateTokenProps) => {
  const [name, setName] = useState("");
  const [total, setTotal] = useState<string>("");
  const [additionalJson, setAdditionalJson] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("El campo 'name' es obligatorio.");
      return;
    }

    const totalNumber = total === "" ? NaN : Number(total);
    if (!Number.isFinite(totalNumber) || totalNumber < 0) {
      setError("El campo 'total' debe ser un número válido mayor o igual a 0.");
      return;
    }

    onCreate({
      name: name.trim(),
      total: totalNumber,
      additionalInfo: additionalJson.trim(),
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="create-token-title"
    >
      <DialogTitle id="create-token-title">
        <Stack direction="row" alignItems="center" spacing={1}>
          <PropaneIcon />
          <span>Crear token</span>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={1}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
            id="create-token-form"
          >
            <TextField
              label="Nombre"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
              autoFocus
            />

            <TextField
              label="Total (gr)"
              name="total"
              required
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              fullWidth
              margin="normal"
              type="number"
            />

            <TextField
              label="Información adicional (JSON)"
              value={additionalJson}
              onChange={(e) => setAdditionalJson(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              minRows={4}
              placeholder='{"tipo":"vidrio","color":"verde"}'
              sx={{ fontFamily: "monospace" }}
            />

            {error && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="error">{error}</Alert>
              </Box>
            )}
          </Box>
          <Typography variant="caption" color="textSecondary">
            Nota: La información adicional debe ser un JSON válido o dejarse en
            blanco.
          </Typography>
          <AdditionalInfo role={role} />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" fullWidth>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSubmit()}
          fullWidth
          startIcon={<AddIcon />}
        >
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateToken;
