import { Typography } from "@mui/material";

const QuantityInfo = ({ amount }: { amount: number }) => (
  <Typography variant="body2" color="text.secondary">
    Cantidad: {amount} gr.
  </Typography>
);

export default QuantityInfo;
