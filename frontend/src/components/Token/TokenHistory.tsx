import { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Chip,
  Dialog,
  Divider,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { useTraceability } from "@hooks/useTraceability";

import {
  IAccountInfo,
  ITokenHistoryEntry,
  ITokenInfo,
  mapRoleToLabel,
  mapTokenStageToLabel,
} from "../../interfaces";
import { useAccessManager } from "@hooks/useAccessManager";
import { ROLE_NAMES } from "@utils/accessAdapters";
import { formatAddress } from "@utils/helpers";
import StageIcon from "./StageIcon";
import LoadingOverlay from "../../layout/LoadingOverlay";

const TokenHistory = ({
  token,
  onClose,
}: {
  token: ITokenInfo;
  onClose: () => void;
}) => {
  const [history, setHistory] = useState<ITokenHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [holderInfos, setHolderInfos] = useState<Record<string, IAccountInfo>>(
    {}
  );
  const { isServiceReady, getTokenHistory } = useTraceability();
  const { getAccountInfo } = useAccessManager();

  useEffect(() => {
    if (!isServiceReady) return;

    async function fetchData() {
      try {
        setIsLoading(true);
        const tokenHistory = await getTokenHistory(token.id);
        setHistory(tokenHistory);
      } catch (err) {
        alert(`Error al cargar los tokens: ${err}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isServiceReady]);

  useEffect(() => {
    if (!history?.length) return;

    async function fetchRoles() {
      const results: Record<string, IAccountInfo> = {};

      for (const h of history) {
        const { newHolder } = h;
        if (newHolder && !results[newHolder]) {
          if (getAccountInfo == null) continue;

          const info = await getAccountInfo(newHolder);
          results[newHolder] = info;
        }
      }

      setHolderInfos(results);
    }

    fetchRoles();
  }, [history, getAccountInfo]);

  return (
    <Dialog open={true} fullWidth maxWidth="sm" onClose={onClose}>
      <LoadingOverlay loading={isLoading} />
      <Paper sx={{ p: 2, borderRadius: 2 }} elevation={1}>
        <Typography variant="h6" component="h3" gutterBottom>
          Historial de Custodia
        </Typography>

        <List>
          {history.map((h, i) => {
            const info = holderInfos[h.newHolder];

            return (
              <Box key={i}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      sx={{ bgcolor: "primary.light", width: 40, height: 40 }}
                    >
                      <StageIcon stage={h.action} />
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {mapTokenStageToLabel[h.action]} —{" "}
                        </Typography>
                        <Chip
                          variant="outlined"
                          size="small"
                          label={formatAddress(h.newHolder)}
                        />
                        {info && (
                          <Chip
                            label={
                              mapRoleToLabel[ROLE_NAMES[info.role]] ||
                              "Desconocido"
                            }
                            size="small"
                          />
                        )}
                      </Stack>
                    }
                    secondary={
                      <>
                        {h.timestamp}
                        <Link
                          href={`https://sepolia.etherscan.io/tx/${h.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="caption"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          Ver transacción
                        </Link>
                      </>
                    }
                  />
                </ListItem>

                {i < history.length - 1 && <Divider component="li" />}
              </Box>
            );
          })}
        </List>
      </Paper>
    </Dialog>
  );
};

export default TokenHistory;
