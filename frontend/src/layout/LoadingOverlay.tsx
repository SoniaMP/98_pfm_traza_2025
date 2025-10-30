import { Backdrop, CircularProgress } from "@mui/material";

const LoadingOverlay = ({ loading = false }) => {
  return (
    <Backdrop open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default LoadingOverlay;
