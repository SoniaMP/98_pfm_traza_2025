import { Chip, styled } from "@mui/material";

export const AddressChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  color: theme.palette.common.white,
  border: `1px solid ${theme.palette.common.white}`,
  fontFamily: "monospace",
  fontSize: "0.75rem",
}));

export const HeaderChip = styled(Chip)(({ theme }) => ({
  color: theme.palette.common.white,
  border: `1px solid ${theme.palette.common.white}`,
  fontFamily: "monospace",
  fontSize: "0.75rem",
}));
