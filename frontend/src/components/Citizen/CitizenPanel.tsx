import React from "react";
import { Card, CardContent, Stack, Avatar, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import RewardIcon from "@mui/icons-material/GradeOutlined";

import { formatAddress } from "@utils/helpers";
import CardHeaderTitle from "@components/common/CardHeaderTitle";

type Props = {
  account: string;
  redeemable: number | string;
};

const CitizenPanel: React.FC<Props> = ({ account, redeemable }) => {
  return (
    <Card>
      <CardContent>
        <Stack textAlign="justify" spacing={2}>
          <CardHeaderTitle
            title="Panel de Ciudadano"
            helperText="Información de la cuenta y puntos canjeables"
          />

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              textAlign="justify"
            >
              <Avatar sx={{ width: 44, height: 44 }}>
                <AccountCircleIcon />
              </Avatar>
              <Stack direction="column">
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color="text.secondary"
                >
                  {formatAddress(account)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", opacity: 0.8 }}
                >
                  {account}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
              <RewardIcon fontSize="large" sx={{ color: "darkgoldenrod" }} />
              <Stack textAlign="justify">
                <Typography variant="h6" fontWeight={700}>
                  {redeemable}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", opacity: 0.8 }}
                >
                  Puntos canjeables
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CitizenPanel;
