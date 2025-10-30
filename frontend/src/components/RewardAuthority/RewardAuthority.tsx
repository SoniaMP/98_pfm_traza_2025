import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Typography,
  Stack,
  Container,
  Chip,
  Grid,
} from "@mui/material";
import AwardIcon from "@mui/icons-material/EmojiEventsOutlined";
import AcceptIcon from "@mui/icons-material/ThumbUpAltOutlined";
import RejectIcon from "@mui/icons-material/ThumbDownAltOutlined";

import { useWallet } from "@context/metamask/provider";
import { useTraceability } from "@hooks/useTraceability";
import TokensTable from "@components/Token/TokensTable";
import EmptySection from "@components/common/EmptySection";
import AddressInfo from "@components/common/AddressInfo";
import RewardTokenForm from "@components/Token/RewardTokenForm";
import {
  IRewardedToken,
  ITokenInfo,
  ITokenTransfer,
  mapTransferStatusToLabel,
  TokenStage,
  TransferStatus,
} from "../../interfaces";
import LoadingOverlay from "../../layout/LoadingOverlay";
import CardHeaderTitle from "@components/common/CardHeaderTitle";
import SectionTitle from "@components/common/SectionTitle";
import QuantityInfo from "@components/common/QuantityInfo";

const RewardAuthority = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [pendingTransfers, setPendingTransfers] = useState<ITokenTransfer[]>(
    []
  );
  const [ownedTokens, setOwnedTokens] = useState<ITokenInfo[]>([]);
  const [rewardedTokens, setRewardedTokens] = useState<IRewardedToken[]>([]);

  const { account } = useWallet();
  const {
    acceptTransfer,
    getAllTokens,
    getRewardedTokens,
    getTransfers,
    isServiceReady,
    rejectTransfer,
    rewardToken,
  } = useTraceability();

  const refresh = async () => {
    setIsLoading(true);

    const [allTransfers, allTokens, rewardedTokens] = await Promise.all([
      getTransfers(),
      getAllTokens(),
      getRewardedTokens(),
    ]);

    const regulatorTokens = allTokens.filter(
      (t: ITokenInfo) =>
        t.currentHolder.toLowerCase() === account?.toLowerCase() &&
        t.stage === TokenStage.Processed
    );

    const pendingTransfers = allTransfers.filter(
      (tr: ITokenTransfer) =>
        tr.to.toLowerCase() === account?.toLowerCase() &&
        tr.status === TransferStatus.Pending
    );

    setPendingTransfers(pendingTransfers);
    setOwnedTokens(regulatorTokens);
    setRewardedTokens(rewardedTokens);

    setIsLoading(false);
  };

  useEffect(() => {
    if (isServiceReady) {
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, isServiceReady]);

  const handleReward = async (
    to: string,
    amount: number,
    rewardFeatures: string
  ) => {
    if (!rewardToken || tokenId === null) return;

    try {
      setIsLoading(true);
      await rewardToken(tokenId, amount, rewardFeatures);
      await refresh();
    } catch (err) {
      console.error("Error rewarding citizen:", err);
    } finally {
      setIsLoading(false);
      setShowTransferDialog(false);
    }
  };

  const handleReject = async (transferId: number) => {
    if (!rejectTransfer) return;

    try {
      setIsLoading(true);
      await rejectTransfer(transferId);
      await refresh();
    } catch (err) {
      console.error("Error rejecting transfer:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (transferId: number) => {
    if (!acceptTransfer) return;

    try {
      setIsLoading(true);
      await acceptTransfer(transferId);
      await refresh();
    } catch (err) {
      console.error("Error accepting transfer:", err);
    } finally {
      setIsLoading(false);
    }
  };

  function handleShowTransferDialog(tokenId: number) {
    setTokenId(tokenId);
    setShowTransferDialog(true);
  }

  return (
    <Container sx={{ py: 2 }} maxWidth="xl">
      <LoadingOverlay loading={isLoading} />

      <Stack spacing={3}>
        <SectionTitle
          title="Gestión de Recompensas - Entidad Reguladora"
          infoText="Gestiona las recompensas para los ciudadanos y revisa las transferencias de tokens pendientes."
        />

        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
        >
          <Grid size={{ xs: 6 }}>
            <Card>
              <CardHeader
                title={
                  <CardHeaderTitle
                    title="Tokens recibidos (pendientes de recompensa)"
                    helperText="Transferencias de tokens que has recibido y que están pendientes de recompensa."
                  />
                }
              />
              <CardContent>
                {pendingTransfers.length === 0 && !isLoading ? (
                  <EmptySection message="No hay transferencias disponibles." />
                ) : (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>ID</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Token</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Origen</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Destino</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Cantidad</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Estado</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Acciones</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingTransfers.map((transfer) => (
                        <TableRow key={transfer.id}>
                          <TableCell>#{transfer.id}</TableCell>
                          <TableCell>Token #{transfer.tokenId}</TableCell>
                          <TableCell>
                            <AddressInfo address={transfer.from} />
                          </TableCell>
                          <TableCell>
                            <AddressInfo address={transfer.to} />
                          </TableCell>
                          <TableCell align="center">
                            {transfer.amount}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              size="small"
                              color={
                                transfer.status === 1
                                  ? "warning"
                                  : transfer.status === 2
                                  ? "success"
                                  : transfer.status === 3
                                  ? "error"
                                  : "default"
                              }
                              label={mapTransferStatusToLabel[transfer.status]}
                            />
                          </TableCell>
                          <TableCell align="center">
                            {transfer.status === 1 && (
                              <Stack
                                direction="row"
                                spacing={1}
                                justifyContent="center"
                              >
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  startIcon={<RejectIcon />}
                                  onClick={() => handleReject(transfer.id)}
                                >
                                  Rechazar
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="primary"
                                  startIcon={<AcceptIcon />}
                                  onClick={() => handleAccept(transfer.id)}
                                >
                                  Aceptar
                                </Button>
                              </Stack>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Card>
              <CardHeader
                title={
                  <CardHeaderTitle
                    title="Pendiente de emitir recompensa"
                    helperText="Tokens que están listos para ser recompensados por el ciudadano correspondiente."
                  />
                }
              />
              <CardContent>
                <TokensTable
                  tokens={ownedTokens}
                  label="Recompensar"
                  startIcon={<AwardIcon />}
                  onClick={handleShowTransferDialog}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <CardHeader
            title={
              <CardHeaderTitle
                title="Historial de tokens recompensados"
                helperText="Lista de tokens que han sido recompensados por ti."
              />
            }
          />
          <CardContent>
            {rewardedTokens.length === 0 ? (
              <Typography color="text.secondary">
                Aún no se ha recompensado ningún token.
              </Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Ciudadano</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Características</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rewardedTokens.map((t: IRewardedToken) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.id}</TableCell>
                      <TableCell>
                        <AddressInfo label="" address={t.citizen} />
                      </TableCell>
                      <TableCell>
                        <QuantityInfo amount={t.amount} />
                      </TableCell>
                      <TableCell>
                        <pre
                          style={{
                            margin: 0,
                            fontFamily:
                              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                          }}
                        >
                          {t.rewardFeatures
                            ? JSON.stringify(t.rewardFeatures, null, 2)
                            : "N/A"}
                        </pre>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Stack>

      {showTransferDialog && (
        <RewardTokenForm
          account={account}
          open={showTransferDialog}
          onClose={() => setShowTransferDialog(false)}
          onSubmit={handleReward}
        />
      )}
    </Container>
  );
};

export default RewardAuthority;
