import { useState } from "react";
import { Container, Typography, Box, TextField, Button } from "@mui/material";
import api from "../api/api";
import SnackbarAlert from "../components/SnackbarAlert";

interface LoginPageProps {
  lang?: "pt" | "en";
}

const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  required = false,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) => (
  <TextField
    fullWidth
    margin="normal"
    type={type}
    label={label + (required ? " *" : "")}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default function LoginPage({ lang = "pt" }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "success" | "error",
  });

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    if (!email || !password) {
      setSnackbar({
        open: true,
        message: "Preencha todos os campos",
        severity: "error",
      });
      return;
    }

    if (!validateEmail(email)) {
      setSnackbar({ open: true, message: "Email inválido", severity: "error" });
      return;
    }

    try {
      const { data } = await api.post("/users/login", { email, password });
      localStorage.setItem("token", data.token);
      window.location.href = "/profile";
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Erro ao logar",
        severity: "error",
      });
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={10} textAlign="center">
        <Typography variant="h4" gutterBottom>
          CRM Simplificado - Login
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Faça login para acessar o sistema
        </Typography>

        <InputField label="Email" value={email} onChange={setEmail} required />
        <InputField
          label="Senha"
          type="password"
          value={password}
          onChange={setPassword}
          required
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Entrar
        </Button>
      </Box>

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Container>
  );
}
