import type { FC, PropsWithChildren } from "react";
import { Card, Container } from "@mui/material";

export const CardLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Container sx={{ py: 4 }} maxWidth="sm">
      <Card sx={{ p: 4 }}>{children}</Card>
    </Container>
  );
};
