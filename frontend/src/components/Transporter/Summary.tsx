import { Grid } from "@mui/material";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import CallReceivedOutlinedIcon from "@mui/icons-material/CallReceivedOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import MoveDownOutlinedIcon from "@mui/icons-material/MoveDownOutlined";

import SummaryContainer from "@components/common/SummaryContainer";

const Summary = ({
  pendingTokens = 0,
  ownedTokens = 0,
  collectedTokens = 0,
  transferedTokens = 0,
}) => {
  return (
    <Grid container spacing={2}>
      <SummaryContainer
        title="Pendiente de recogida"
        total={pendingTokens}
        icon={CallReceivedOutlinedIcon}
        caption="Tokens que están pendientes de ser recogidos"
        size={{ xs: 12, sm: 3 }}
      />
      <SummaryContainer
        title="Pendientes de transporte"
        total={ownedTokens}
        icon={LocalShippingOutlinedIcon}
        color="warning"
        caption="Tokens que están pendientes de ser transportados"
        size={{ xs: 12, sm: 3 }}
      />
      <SummaryContainer
        title="Recogidos"
        total={collectedTokens}
        color="success"
        icon={DoneAllOutlinedIcon}
        caption="Tokens que han sido recogidos"
        size={{ xs: 12, sm: 3 }}
      />
      <SummaryContainer
        title="Transferidos"
        total={transferedTokens}
        color="success"
        icon={MoveDownOutlinedIcon}
        caption="Tokens que han sido transferidos"
        size={{ xs: 12, sm: 3 }}
      />
    </Grid>
  );
};

export default Summary;
