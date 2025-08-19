import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { CustomerIProps } from "../../utils/types/customer";
import SnackbarAlert from "../SnackbarAlert";

interface CustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CustomerIProps) => void;
  initialData?: CustomerIProps | null;
  mode?: "create" | "edit" | "view";
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 2,
};

const CustomerModal: React.FC<CustomerModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  mode = "create",
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [createdBy, setCreatedBy] = useState<string>("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "success" | "error",
  });

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setPhone(initialData.phone || "");
      setCreatedBy(initialData.createdBy?.name || "");
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setCreatedBy("");
    }
  }, [initialData, open]);

  const isView = mode === "view";

  const validateFields = () => {
    if (!name.trim()) {
      setSnackbar({
        open: true,
        message: "Nome é obrigatório",
        severity: "error",
      });
      return false;
    }
    if (!email.trim()) {
      setSnackbar({
        open: true,
        message: "Email é obrigatório",
        severity: "error",
      });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSnackbar({ open: true, message: "Email inválido", severity: "error" });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateFields()) return;

    const customerData = {
      ...initialData,
      name,
      email,
      phone,
    } as CustomerIProps;

    onSave(customerData);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2} align="center">
          {mode === "create"
            ? "Novo Cliente"
            : mode === "edit"
            ? "Editar Cliente"
            : "Visualizar Cliente"}
        </Typography>

        <TextField
          label="Nome"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isView}
        />
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isView}
        />
        <TextField
          label="Telefone"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isView}
        />
        {createdBy && (
          <TextField label="Criado por" fullWidth value={createdBy} disabled />
        )}

        {mode === "view" && initialData?.attendances?.length && (
          <Box sx={{ width: "100%", flex: 1 }}>
            <Typography variant="h6" gutterBottom align="center">
              Atendimentos
            </Typography>
            <DataGrid
              rows={initialData?.attendances.map(
                (
                  a: {
                    id: any;
                    subject: any;
                    user: { name: any };
                    status: any;
                    channel: any;
                    createdAt: string | number | Date;
                  },
                  i: number
                ) => ({
                  id: a.id,
                  number: i + 1,
                  subject: a.subject,
                  responsible: a.user?.name || "Desconhecido",
                  status: a.status,
                  channel: a.channel,
                  createdAt: new Date(a.createdAt).toLocaleDateString("pt-BR"),
                })
              )}
              columns={[
                { field: "number", headerName: "#", width: 70 },
                { field: "subject", headerName: "Assunto", flex: 1 },
                { field: "responsible", headerName: "Responsável", flex: 1 },
                { field: "status", headerName: "Status", flex: 1 },
                { field: "channel", headerName: "Canal", flex: 1 },
                { field: "createdAt", headerName: "Criado em", flex: 1 },
              ]}
              sx={{ height: 300 }}
            />
          </Box>
        )}

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
            gap: 2,
            width: "100%",
          }}
        >
          {isView ? (
            <Button variant="contained" onClick={onClose}>
              Fechar
            </Button>
          ) : (
            <>
              <Button variant="outlined" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Salvar
              </Button>
            </>
          )}
        </Box>

        <SnackbarAlert
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </Box>
    </Modal>
  );
};

export default CustomerModal;
