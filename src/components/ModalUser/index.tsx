import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
} from "@mui/material";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<UserData> & { password?: string }) => void;
  initialData?: UserData | null;
  readOnly?: boolean;
}

export interface UserData {
  id?: string;
  name: string;
  email: string;
  role: "ATTENDANT" | "SELLER" | "ADMIN";
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 550,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

const UserModal: React.FC<UserModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  readOnly = false,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [role, setRole] = useState<UserData["role"]>(
    initialData?.role || "ATTENDANT"
  );
  const [password, setPassword] = useState("");

  useEffect(() => {
    setName(initialData?.name || "");
    setEmail(initialData?.email || "");
    setRole(initialData?.role || "ATTENDANT");
    setPassword(""); // limpa senha ao abrir
  }, [initialData, open]);

  const handleSave = () => {
    if (!name || !email || (!initialData && !password)) {
      alert("Preencha todos os campos!");
      return;
    }
    onSave({ id: initialData?.id, name, email, role, password });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          {readOnly
            ? "Visualizar Usuário"
            : initialData
            ? "Editar Usuário"
            : "Novo Usuário"}
        </Typography>

        <Grid container spacing={2}>
          <Grid>
            <TextField
              label="Nome"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
              disabled={readOnly}
              sx={{ borderRadius: 2 }}
            />
          </Grid>

          <Grid>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="small"
              disabled={readOnly}
              sx={{ borderRadius: 2 }}
            />
          </Grid>

          {!initialData && (
            <Grid>
              <TextField
                label="Senha"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="small"
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          )}

          <Grid>
            <TextField
              select
              label="Função"
              fullWidth
              value={role}
              onChange={(e) => setRole(e.target.value as UserData["role"])}
              size="small"
              disabled={readOnly}
            >
              <MenuItem value="SELLER">Vendedor</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </TextField>
          </Grid>

          {!readOnly && (
            <Grid container justifyContent="flex-end" spacing={1}>
              <Grid>
                <Button variant="outlined" onClick={onClose}>
                  Cancelar
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  color="primary"
                >
                  Salvar
                </Button>
              </Grid>
            </Grid>
          )}

          {readOnly && (
            <Grid container justifyContent="flex-end">
              <Button variant="contained" onClick={onClose}>
                Fechar
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
    </Modal>
  );
};

export default UserModal;
