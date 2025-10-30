import { Typography } from "@mui/material";

import { useGlobal } from "@context/global/provider";
import UnderRevision from "@components/UserAccess/UnderRevision";
import RejectedAccount from "@components/UserAccess/RejectedAccount";
import { AccountStatus, UserRole } from "../../interfaces";
import { CardLayout } from "../../layouts";
import Transporter from "../Transporter";
import Citizen from "../Citizen";
import Processor from "../Processor";
import RewardAuthority from "../RewardAuthority/RewardAuthority";
import AdminPanel from "@components/Admin";

const mappingRolesToComponents: { [key in UserRole]: React.FC } = {
  [UserRole.ADMIN]: AdminPanel,
  [UserRole.CITIZEN]: Citizen,
  [UserRole.TRANSPORTER]: Transporter,
  [UserRole.PROCESSOR]: Processor,
  [UserRole.REWARD_AUTHORITY]: RewardAuthority,
};

const DashboardRouter = () => {
  const { userInfo } = useGlobal();

  if (!userInfo) return null;

  const DashboardComponent =
    mappingRolesToComponents[userInfo.role as UserRole];

  switch (userInfo.status) {
    case AccountStatus.Pending:
      return <UnderRevision />;

    case AccountStatus.Rejected:
      return <RejectedAccount />;

    case AccountStatus.Canceled:
      return (
        <CardLayout>
          <Typography>Tu acceso fue cancelado.</Typography>
        </CardLayout>
      );

    default:
      return <DashboardComponent />;
  }
};

export default DashboardRouter;
