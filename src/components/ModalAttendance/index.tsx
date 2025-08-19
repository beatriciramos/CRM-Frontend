import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import api from "../../api/api";
import SnackbarAlert from "../SnackbarAlert";

interface AttendanceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  mode: "create" | "edit" | "view";
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  mode,
}) => {
  const [attendance, setAttendance] = useState<any>({
    customerId: "",
    subject: "",
    notes: "",
    status: "OPEN",
    channel: "CALL",
  });
  const [customers, setCustomers] = useState<any[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "success" | "error",
  });

  const isView = mode === "view";

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (initialData) setAttendance(initialData);
    else
      setAttendance({
        customerId: "",
        subject: "",
        notes: "",
        status: "OPEN",
        channel: "CALL",
      });
  }, [initialData, open]);

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get("/customers");
      setCustomers(data);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Erro ao buscar clientes",
        severity: "error",
      });
    }
  };

  const handleChange = (field: string, value: any) => {
    setAttendance({ ...attendance, [field]: value });
  };

  const handleSave = () => {
    if (!attendance.customerId || !attendance.subject) {
      setSnackbar({
        open: true,
        message: "Preencha todos os campos obrigatórios",
        severity: "error",
      });
      return;
    }
    onSave(attendance);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {mode === "create"
            ? "Novo Atendimento"
            : mode === "edit"
            ? "Editar Atendimento"
            : "Visualizar Atendimento"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid>
              <TextField
                select
                label="Cliente *"
                value={attendance.customerId}
                onChange={(e) => handleChange("customerId", e.target.value)}
                fullWidth
                disabled={isView}
                sx={{ minWidth: 210 }}
              >
                <MenuItem value="">
                  <em>Selecionar Cliente</em>
                </MenuItem>
                {customers.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid>
              <TextField
                label="Assunto *"
                value={attendance.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                fullWidth
                disabled={isView}
              />
            </Grid>

            <Grid>
              <TextField
                label="Notas"
                value={attendance.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                fullWidth
                multiline
                minRows={4}
                disabled={isView}
              />
            </Grid>

            <Grid>
              <TextField
                select
                label="Status"
                value={attendance.status}
                onChange={(e) => handleChange("status", e.target.value)}
                fullWidth
                disabled={isView}
              >
                <MenuItem value="OPEN">Aberto</MenuItem>
                <MenuItem value="CLOSED">Fechado</MenuItem>
              </TextField>
            </Grid>

            <Grid>
              <TextField
                select
                label="Canal"
                value={attendance.channel}
                onChange={(e) => handleChange("channel", e.target.value)}
                fullWidth
                disabled={isView}
              >
                <MenuItem value="CALL">Ligação</MenuItem>
                <MenuItem value="EMAIL">Email</MenuItem>
                <MenuItem value="WHATSAPP">Whatsapp</MenuItem>
                <MenuItem value="MEETING">Meeting</MenuItem>
                <MenuItem value="OTHER">Outro</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Fechar</Button>
          {!isView && (
            <Button onClick={handleSave} variant="contained" color="primary">
              Salvar
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default AttendanceModal;
