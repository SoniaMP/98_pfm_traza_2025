import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AcceptIcon from "@mui/icons-material/ThumbUpAltOutlined";
import RejectIcon from "@mui/icons-material/ThumbDownAltOutlined";
import { useEffect, useState } from "react";

import LoadingOverlay from "../../layout/LoadingOverlay";
import { useTraceability } from "@hooks/useTraceability";
import EmptySection from "@components/common/EmptySection";
import AddressInfo from "@components/common/AddressInfo";
import {
  ITokenInfo,
  ITokenTransfer,
  mapTransferStatusToLabel,
  TokenStage,
  TransferStatus,
} from "../../interfaces";
import { useWallet } from "@context/metamask/provider";
import TransferTokenForm from "@components/Token/TransferTokenForm";
import TokensTable from "@components/Token/TokensTable";
import CardHeaderTitle from "@components/common/CardHeaderTitle";
import Summary from "./Summary";
import SectionTitle from "@components/common/SectionTitle";

const Processor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [pendingTransfers, setPendingTransfers] = useState<ITokenTransfer[]>(
    []
  );
  const [ownedTokens, setOwnedTokens] = useState<ITokenInfo[]>([]);
  const [processedTokens, setProcessedTokens] = useState<ITokenInfo[]>([]);
  const { account } = useWallet();

  const {
    acceptTransfer,
    rejectTransfer,
    getProcessedTokens,
    getTransfers,
    getAllTokens,
    processToken,
    transfer,
    isServiceReady,
  } = useTraceability();

  const refresh = async () => {
    setIsLoading(true);

    const [allTransfers, allTokens, processedTokens] = await Promise.all([
      getTransfers(),
      getAllTokens(),
      getProcessedTokens(),
    ]);

    // Transfers pendientes de aceptación o rechazo por el procesador
    const pendingTransfers = allTransfers.filter(
      (tr: any) =>
        tr.to.toLowerCase() === account?.toLowerCase() &&
        tr.status === TransferStatus.Pending
    );

    const collectedTokens = allTokens.filter(
      (t: any) =>
        t.currentHolder.toLowerCase() === account?.toLowerCase() &&
        t.stage === TokenStage.Collected
    );

    setPendingTransfers(pendingTransfers);
    setOwnedTokens(collectedTokens);
    setProcessedTokens(processedTokens);

    setIsLoading(false);
  };

  const refreshTokenTransfers = async () => {
    refresh();
  };

  useEffect(() => {
    if (isServiceReady) refreshTokenTransfers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isServiceReady]);

  const handleReject = async (transferId: number) => {
    if (!rejectTransfer) return;

    try {
      setIsLoading(true);
      await rejectTransfer(transferId);
      await refreshTokenTransfers();
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
      await refreshTokenTransfers();
    } catch (err) {
      console.error("Error accepting transfer:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcess = async (
    to: string,
    amount: number,
    features: string
  ) => {
    if (!transfer || !processToken || tokenId === null) return;

    try {
      setIsLoading(true);
      await processToken(tokenId, features);
      await transfer(tokenId, to, amount);
      await refreshTokenTransfers();
    } catch (err) {
      console.error("Error processing token:", err);
    } finally {
      setIsLoading(false);
      setShowTransferDialog(false);
    }
  };

  function handleTransfer(tokenId: number) {
    setTokenId(tokenId);
    setShowTransferDialog(true);
  }

  return (
    <Container sx={{ py: 2 }} maxWidth="xl">
      <LoadingOverlay loading={isLoading} />

      <Stack spacing={3}>
        <SectionTitle
          title="Centro de Procesamiento"
          infoText="Gestiona las transferencias de tokens pendientes y procesa los tokens recogidos"
        />

        <Summary
          pendingTokens={pendingTransfers.length}
          ownedTokens={ownedTokens.length}
          collectedTokens={processedTokens.length}
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
                    title="Transferencias pendientes de aceptar"
                    helperText="Lista de tokens que están pendientes de ser aceptados o rechazados por el procesador."
                  />
                }
              />
              <CardContent>
                {pendingTransfers.length === 0 && !isLoading ? (
                  <EmptySection message="No hay transferencias disponibles." />
                ) : (
                  <TableContainer component={Card}>
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
                                label={
                                  mapTransferStatusToLabel[transfer.status]
                                }
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
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Card>
              <CardHeader
                title={
                  <CardHeaderTitle
                    title="Pendiente de procesar"
                    helperText="Lista de tokens que están disponibles para ser procesados"
                  />
                }
              />
              <CardContent>
                <TokensTable tokens={ownedTokens} onClick={handleTransfer} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <CardHeader
            title={
              <CardHeaderTitle
                title="Historial de tokens procesados"
                helperText="Lista de tokens que han sido procesados por el procesador"
              />
            }
          />
          <CardContent>
            <TokensTable tokens={processedTokens} enableActions={false} />
          </CardContent>
        </Card>
      </Stack>

      {showTransferDialog && (
        <TransferTokenForm
          enableFeatures
          open={showTransferDialog}
          onClose={() => setShowTransferDialog(false)}
          onSubmit={handleProcess}
        />
      )}
    </Container>
  );
};

export default Processor;
