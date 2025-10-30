/*
 * .
 *        . * .
 *      * RRRR  *   Copyright (c) 2012 - 2025
 *     .  RR  R  .  EUIPO - European Union Intellectual Property Office
 *     *  RRR    *
 *      . RR RR .   ALL RIGHTS RESERVED
 *       *. _ .*
 * .
 *  The use and distribution of this software is under the restrictions exposed in 'license.txt'
 */

import { Grid } from "@mui/material";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import CallReceivedOutlinedIcon from "@mui/icons-material/CallReceivedOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

import SummaryContainer from "@components/common/SummaryContainer";

const Summary = ({
  pendingTokens = 0,
  ownedTokens = 0,
  collectedTokens = 0,
}) => {
  return (
    <Grid container spacing={2}>
      <SummaryContainer
        title="Pendiente de aceptar"
        total={pendingTokens}
        icon={CallReceivedOutlinedIcon}
        caption="Tokens que están pendientes de ser aceptados"
      />
      <SummaryContainer
        title="Pendientes de procesar"
        total={ownedTokens}
        icon={LocalShippingOutlinedIcon}
        color="warning"
        caption="Tokens que están pendientes de ser procesados"
      />
      <SummaryContainer
        title="Procesados"
        total={collectedTokens}
        color="success"
        icon={DoneAllOutlinedIcon}
        caption="Tokens que han sido procesados"
      />
    </Grid>
  );
};

export default Summary;
