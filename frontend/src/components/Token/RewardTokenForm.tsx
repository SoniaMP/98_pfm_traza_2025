import { FormEvent, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const RewardTokenForm = ({ account, open, onClose, onSubmit }: any) => {
  const [amount, setAmount] = useState<string>("");
  const [features, setFeatures] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const amt = String(amount).trim();

    if (!amt) {
      alert("Cantidad es obligatoria");
      return;
    }

    setAmount("");
    setFeatures("");
    onSubmit(account, Number(amt), features);
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="reward-dialog-title">
      <form onSubmit={handleSubmit}>
        <DialogTitle id="reward-dialog-title">Enviar Reward Token</DialogTitle>

        <DialogContent dividers>
          <TextField
            label="Dirección destino"
            name="to"
            value={account}
            disabled
            fullWidth
            margin="dense"
            placeholder="0x..."
          />

          <TextField
            label="Cantidad"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            fullWidth
            margin="dense"
            type="number"
            placeholder="0.0"
          />

          <TextField
            rows={4}
            label="Características"
            fullWidth
            margin="normal"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            multiline
          />
        </DialogContent>

        <DialogActions>
          <Button type="submit" variant="contained" color="primary">
            Enviar
          </Button>
          <Button type="button" onClick={onClose}>
            Cancelar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RewardTokenForm;
