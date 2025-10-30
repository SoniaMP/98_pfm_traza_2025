import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PropaneIcon from "@mui/icons-material/PropaneTankOutlined";

import { ITokenInfo, mapTokenStageToLabel, TokenStage } from "../../interfaces";

const TokenList = ({
  tokens,
  onAddToken,
  onViewDetails,
}: {
  tokens: ITokenInfo[];
  onAddToken: () => void;
  onViewDetails: (token: ITokenInfo) => void;
}) => {
  function getChipStageColor(
    stage: TokenStage
  ): "primary" | "success" | "warning" {
    switch (stage) {
      case TokenStage.Created:
      case TokenStage.Rewarded:
        return "success";
      default:
        return "warning";
    }
  }

  function getJsonFeaturesToString(featuresJson: string) {
    try {
      return JSON.parse(featuresJson);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return "";
    }
  }

  return (
    <Stack spacing={1}>
      <Box display="flex" alignItems="center" mb={2}>
        <Stack sx={{ flexGrow: 1 }}>
          <Typography variant="h6">
            {tokens.length} tokens encontrados
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Lista de tokens registrados en el sistema para el usuario
          </Typography>
        </Stack>

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={onAddToken}
          sx={{ height: 40 }}
        >
          Agregar Token
        </Button>
      </Box>

      <Grid container spacing={1}>
        {tokens.map((token, index) => {
          const {
            creator,
            name,
            stage,
            totalSupply,
            dateCreated,
            citizenFeatures,
          } = token;
          const featuresString = getJsonFeaturesToString(citizenFeatures);

          return (
            <Grid size={{ xs: 3 }} key={`token.${creator}-${name}`}>
              <Card>
                <CardHeader
                  title={
                    <Box display="flex" justifyContent="space-between">
                      <Stack
                        direction="column"
                        alignItems="flex-start"
                        textAlign="left"
                      >
                        <Typography variant="body1" fontWeight="fontWeightBold">
                          {name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Token #{index + 1}
                        </Typography>
                      </Stack>
                      <Chip
                        label={mapTokenStageToLabel[stage]}
                        color={getChipStageColor(stage)}
                        variant="filled"
                        size="small"
                      />
                    </Box>
                  }
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Grid container spacing={2}>
                      <Grid>
                        <Stack direction="column" textAlign="justify">
                          <Typography variant="caption" fontWeight={600}>
                            Total
                          </Typography>
                          <Typography variant="body2">
                            {totalSupply} gr.
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid>
                        <Stack direction="column" textAlign="justify">
                          <Typography variant="caption" fontWeight={600}>
                            Fecha creación
                          </Typography>
                          <Typography variant="body2">
                            {new Date(dateCreated * 1000).toLocaleDateString()}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid
                        size={{ xs: 12 }}
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Stack direction="column" textAlign="justify">
                          <Typography variant="caption" fontWeight={600}>
                            Características
                          </Typography>
                          <pre
                            style={{
                              margin: 0,
                              fontFamily:
                                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                            }}
                          >
                            {JSON.stringify(featuresString, null, 2)}
                          </pre>
                        </Stack>
                      </Grid>
                    </Grid>
                    <Button
                      variant="outlined"
                      onClick={() => onViewDetails(token)}
                      startIcon={<PropaneIcon />}
                    >
                      Ver detalles
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
};

export default TokenList;
