import { Box, Stack, Typography } from "@mui/material";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";

const EmptySection = ({ message = "" }) => (
  <Box
    sx={{
      width: "100%",
      textAlign: "center",
      opacity: 0.5,
    }}
  >
    <Stack direction="row" alignItems="center" justifyContent="center">
      <NumbersOutlinedIcon />
      <Typography variant="body1" sx={{ ml: 1 }}>
        {message}
      </Typography>
    </Stack>
  </Box>
);

export default EmptySection;
