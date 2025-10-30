import { useEffect, useState } from "react";
import { Container, Stack } from "@mui/material";

import { useTraceability } from "@hooks/useTraceability";
import CreateToken from "@components/Citizen/CreateToken";
import EmptyToken from "@components/Token/EmptyToken";
import TokenList from "@components/Token/TokenList";
import TokenHistory from "@components/Token/TokenHistory";
import { useWallet } from "@context/metamask/provider";
import {
  INewTokenForm,
  IRewardedToken,
  ITokenInfo,
  TokenStage,
  UserRole,
} from "../../interfaces";
import LoadingOverlay from "../../layout/LoadingOverlay";
import Summary from "./Summary";
import CitizenPanel from "./CitizenPanel";
import SectionTitle from "@components/common/SectionTitle";

const Citizen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateTokenForm, setShowCreateTokenForm] = useState(false);
  const [selectedToken, setSelectedToken] = useState<ITokenInfo | null>(null);
  const [showTokenSummary, setShowTokenSummary] = useState(false);
  const [tokens, setTokens] = useState<ITokenInfo[]>([]);
  const [rewardedTokens, setRewardedTokens] = useState<IRewardedToken[]>([]);

  const rewards = rewardedTokens.reduce(
    (total, token) => total + token.amount,
    0
  );

  const {
    createToken,
    getTokensByUser,
    getRewardedTokensByUser,
    isServiceReady,
  } = useTraceability();
  const { account } = useWallet();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const tokens = await getTokensByUser();
        const rewardedTokens = await getRewardedTokensByUser(
          account!.toLowerCase()
        );
        setRewardedTokens(rewardedTokens);
        setTokens(tokens);
      } catch (err) {
        alert(`Error al cargar los tokens: ${err}`);
      } finally {
        setIsLoading(false);
      }
    }

    if (isServiceReady && account) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, isServiceReady]);

  async function handleCreateToken(newToken: INewTokenForm) {
    if (!newToken || !createToken) return;
    try {
      setIsLoading(true);
      await createToken(newToken.name, newToken.total, newToken.additionalInfo);
      const tokens = await getTokensByUser();
      setTokens(tokens);
    } catch (error) {
      console.error("Error creating token:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleViewTokenDetails(token: ITokenInfo) {
    setSelectedToken(token);
    setShowTokenSummary(true);
  }

  return (
    <>
      <Container sx={{ py: 4 }} maxWidth="xl">
        <LoadingOverlay loading={isLoading} />

        <Stack spacing={3}>
          <SectionTitle
            title="Panel de Ciudadano"
            infoText="Gestiona tus tokens y visualiza tus recompensas"
          />

          <Summary
            total={tokens.length}
            pending={
              tokens.filter(
                (token) =>
                  token.stage !== TokenStage.Created &&
                  token.stage !== TokenStage.Rewarded
              ).length
            }
            rewarded={
              tokens.filter((token) => token.stage === TokenStage.Rewarded)
                .length
            }
          />

          <CitizenPanel account={account!} redeemable={rewards} />

          {tokens.length ? (
            <TokenList
              tokens={tokens}
              onAddToken={() => setShowCreateTokenForm(true)}
              onViewDetails={handleViewTokenDetails}
            />
          ) : (
            <EmptyToken onAddToken={() => setShowCreateTokenForm(true)} />
          )}
        </Stack>
      </Container>
      {showCreateTokenForm && (
        <CreateToken
          role={UserRole.CITIZEN}
          open={showCreateTokenForm}
          onClose={() => setShowCreateTokenForm(false)}
          onCreate={handleCreateToken}
        />
      )}
      {showTokenSummary && selectedToken && (
        <TokenHistory
          token={selectedToken}
          onClose={() => setShowTokenSummary(false)}
        />
      )}
    </>
  );
};

export default Citizen;
