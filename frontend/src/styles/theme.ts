import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#333333",
    },
    secondary: {
      main: "#666666",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#000000",
          boxShadow: "none",
          borderBottom: "1px solid #f0f0f0",
          color: "#ffffff",

          ".MuiButtonBase-root ": {
            color: "#ffffff",
            border: "1px solid #e0e0e0",
            "&:hover": {
              backgroundColor: "#222222",
              border: "1px solid #ffffff",
            },
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          justifyContent: "center",
          textAlign: "center",
          border: "1px solid #e0e0e0",
          borderRadius: "0.5rem",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
  },
});

export default theme;
