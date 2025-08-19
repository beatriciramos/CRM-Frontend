import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#fd7e14",
      },
      secondary: {
        main: "#220033",
      },
      background: {
        default: mode === "light" ? "#f5f5f5" : "#1a1a2e",
        paper: mode === "light" ? "#ffffff" : "#1f1f3a",
      },
      text: {
        primary: mode === "light" ? "#28385e" : "#f5f5f5",
        secondary: mode === "light" ? "#555555" : "#cccccc",
      },
    },
    typography: {
      h1: { fontSize: "2.5rem", fontWeight: 700 },
      h2: { fontSize: "2rem", fontWeight: 600 },
      h3: { fontSize: "1.75rem", fontWeight: 500 },
      body1: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.6 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            textTransform: "none",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.03)",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            boxShadow:
              mode === "light"
                ? "0px 4px 12px rgba(0,0,0,0.08)"
                : "0px 4px 12px rgba(0,0,0,0.4)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow:
                mode === "light"
                  ? "0px 6px 20px rgba(0,0,0,0.12)"
                  : "0px 6px 20px rgba(0,0,0,0.6)",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 16,
              "&:hover fieldset": {
                borderColor: "#fd7e14",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#fd7e14",
                boxShadow: "0 0 0 2px rgba(253,126,20,0.2)",
              },
              backgroundColor: mode === "light" ? "#fff" : "#2b2b4b",
              color: mode === "light" ? "#000" : "#f5f5f5",
            },
          },
        },
      },
    },
  });
