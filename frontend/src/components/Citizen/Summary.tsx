import { Grid } from "@mui/material";
import PropaneIcon from "@mui/icons-material/PropaneTankOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";

import SummaryContainer from "@components/common/SummaryContainer";

const Summary = ({ total = 0, pending = 0, rewarded = 0 }) => {
  return (
    <Grid container spacing={2}>
      <SummaryContainer
        title="Total"
        total={total}
        icon={PropaneIcon}
        caption="Total de tokens registrados"
      />
      <SummaryContainer
        title="En proceso"
        total={pending}
        icon={AutorenewOutlinedIcon}
        color="warning"
        caption="Tokens en proceso de recompensa"
      />
      <SummaryContainer
        title="Recompensados"
        total={rewarded}
        color="success"
        icon={DoneAllOutlinedIcon}
        caption="Tokens que han sido recompensados"
      />
    </Grid>
  );
};

export default Summary;
