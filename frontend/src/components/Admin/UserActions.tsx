import { Button, Stack } from "@mui/material";
import AcceptIcon from "@mui/icons-material/ThumbUpAltOutlined";
import RejectIcon from "@mui/icons-material/ThumbDownAltOutlined";

interface UserActionsProps {
  onApprove: () => void;
  onReject: () => void;
}

const UserActions = ({ onApprove, onReject }: UserActionsProps) => {
  return (
    <Stack direction="row" spacing={1}>
      <Button
        size="small"
        variant="outlined"
        color="error"
        startIcon={<RejectIcon />}
        onClick={onReject}
      >
        Rechazar
      </Button>
      <Button
        size="small"
        variant="contained"
        color="success"
        startIcon={<AcceptIcon />}
        onClick={onApprove}
      >
        Aprobar
      </Button>
    </Stack>
  );
};

export default UserActions;
