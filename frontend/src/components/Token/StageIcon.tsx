import FactoryIcon from "@mui/icons-material/FactoryOutlined";
import StarIcon from "@mui/icons-material/GradeOutlined";
import PropaneIcon from "@mui/icons-material/PropaneTankOutlined";
import ShipIcon from "@mui/icons-material/LocalShippingOutlined";

import { TokenStage } from "../../interfaces";

const StageIcon = ({ stage }: { stage: TokenStage }) => {
  const getIcon = (stage: TokenStage) => {
    switch (stage) {
      case TokenStage.Created:
        return <PropaneIcon />;
      case TokenStage.Collected:
        return <ShipIcon />;
      case TokenStage.Processed:
        return <FactoryIcon />;
      case TokenStage.Rewarded:
        return <StarIcon />;
      default:
        return <PropaneIcon />;
    }
  };

  return getIcon(stage);
};

export default StageIcon;
