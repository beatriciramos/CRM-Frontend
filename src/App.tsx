import AppRoutes from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <Navbar />
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}
