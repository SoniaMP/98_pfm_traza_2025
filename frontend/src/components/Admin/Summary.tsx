import { Grid } from "@mui/material";
import GroupRemoveIcon from "@mui/icons-material/GroupRemoveOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";

import SummaryContainer from "@components/common/SummaryContainer";
import { AccountStatus, IAccountInfo } from "../../interfaces";

const Summary = ({ accounts = [] }: { accounts: IAccountInfo[] }) => {
  return (
    <Grid container spacing={2}>
      <SummaryContainer
        title="Total"
        total={accounts.length}
        icon={PeopleAltOutlinedIcon}
        caption="Total de cuentas registradas"
        size={{ xs: 12, sm: 3 }}
      />
      <SummaryContainer
        title="Pendiente"
        total={
          accounts.filter((account) => account.status === AccountStatus.Pending)
            .length
        }
        icon={GroupAddOutlinedIcon}
        color="warning"
        caption="Cuentas pendientes de aprobación"
        size={{ xs: 12, sm: 3 }}
      />
      <SummaryContainer
        title="Aprobados"
        total={
          accounts.filter(
            (account) => account.status === AccountStatus.Approved
          ).length
        }
        color="success"
        icon={HowToRegOutlinedIcon}
        caption="Cuentas aprobadas y activas"
        size={{ xs: 12, sm: 3 }}
      />
      <SummaryContainer
        title="Rechazados"
        total={
          accounts.filter(
            (account) => account.status === AccountStatus.Rejected
          ).length
        }
        icon={GroupRemoveIcon}
        caption="Cuentas rechazadas"
        color="error"
        size={{ xs: 12, sm: 3 }}
      />
    </Grid>
  );
};

export default Summary;
