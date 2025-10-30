import React from "react";
import { Box, Card, Grid, GridProps, Stack, Typography } from "@mui/material";

const SummaryContainer = ({
  title,
  total,
  caption,
  color,
  icon,
  size = { xs: 12, sm: 4 },
}: {
  title: string;
  total: number;
  caption?: string;
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  icon?: React.ElementType;
  size?: GridProps["size"];
}) => {
  const Icon = icon;
  return (
    <Grid size={size}>
      <Card sx={{ p: 2 }}>
        <Stack spacing={1} textAlign="justify">
          <Box display="flex" alignItems="center">
            <Typography variant="body1" sx={{ flexGrow: 1 }} fontWeight={700}>
              {title}
            </Typography>
            {Icon && <Icon size="small" sx={{ width: "1rem", opacity: 0.8 }} />}
          </Box>
          <Typography variant="h6" color={color}>
            {total}
          </Typography>
          {caption && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ opacity: 0.8 }}
            >
              {caption}
            </Typography>
          )}
        </Stack>
      </Card>
    </Grid>
  );
};

export default SummaryContainer;
