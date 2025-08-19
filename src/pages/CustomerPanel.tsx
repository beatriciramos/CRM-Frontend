import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import api from "../api/api";

import SnackbarAlert from "../components/SnackbarAlert";
import { CustomerIProps } from "../utils/types/customer";
import CustomerModal from "../components/ModalCustomer";
import DeleteConfirmModal from "../components/ModalDeleteConfirm";

const CustomerPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerIProps[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerIProps[]>(
    []
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerIProps | null>(
    null
  );
  const [mode, setMode] = useState<"create" | "edit" | "view">("create");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [customerToDelete, setCustomerToDelete] =
    useState<CustomerIProps | null>(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "success" | "error",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get("/customers");
      setCustomers(data);
      setFilteredCustomers(data);
    } catch {
      setSnackbar({
        open: true,
        message: "Erro ao buscar clientes",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    let result = [...customers];
    if (search) {
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          (c.phone && c.phone.includes(search))
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((c) =>
        statusFilter === "active" ? c.active : !c.active
      );
    }
    setFilteredCustomers(result);
  }, [search, statusFilter, customers]);

  const handleAdd = () => {
    setEditingCustomer(null);
    setMode("create");
    setModalOpen(true);
  };
  const handleEdit = (customer: CustomerIProps) => {
    setEditingCustomer(customer);
    setMode("edit");
    setModalOpen(true);
  };
  const handleView = async (customer: CustomerIProps) => {
    try {
      const { data } = await api.get(`/customers/${customer.id}`);
      setEditingCustomer(data);
      setMode("view");
      setModalOpen(true);
    } catch {
      setSnackbar({
        open: true,
        message: "Erro ao carregar cliente",
        severity: "error",
      });
    }
  };

  const handleSave = async (customerData: any) => {
    try {
      if (mode === "edit" && editingCustomer) {
        await api.put(`/customers/${editingCustomer.id}`, customerData);
        setSnackbar({
          open: true,
          message: "Cliente atualizado!",
          severity: "success",
        });
      } else {
        await api.post("/customers", customerData);
        setSnackbar({
          open: true,
          message: "Cliente criado!",
          severity: "success",
        });
      }
      setModalOpen(false);
      fetchCustomers();
    } catch {
      setSnackbar({
        open: true,
        message: "Erro ao salvar cliente",
        severity: "error",
      });
    }
  };

  const handleDelete = (customer: CustomerIProps) => {
    setCustomerToDelete(customer);
    setDeleteConfirm(true);
  };
  const confirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      await api.delete(`/customers/${customerToDelete.id}`);
      setSnackbar({
        open: true,
        message: "Cliente excluído!",
        severity: "success",
      });
      setDeleteConfirm(false);
      setCustomerToDelete(null);
      fetchCustomers();
    } catch {
      setSnackbar({
        open: true,
        message: "Erro ao excluir cliente",
        severity: "error",
      });
    }
  };

  const handleToggleActive = async (customer: CustomerIProps) => {
    try {
      await api.patch(`/customers/${customer.id}/active`, {
        active: !customer.active,
      });
      setSnackbar({
        open: true,
        message: `Cliente ${
          customer.active ? "desativado" : "ativado"
        } com sucesso!`,
        severity: "success",
      });
      fetchCustomers();
    } catch {
      setSnackbar({
        open: true,
        message: "Erro ao atualizar status do cliente",
        severity: "error",
      });
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Nome", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Telefone", flex: 1 },
    {
      field: "attendanceCount",
      headerName: "Atendimentos",
      flex: 0.6,
      renderCell: (params) => params.row._count?.attendances ?? 0,
    },
    {
      field: "active",
      headerName: "Status",
      flex: 0.6,
      renderCell: (params) =>
        params.row.active ? (
          <Typography color="green">Ativo</Typography>
        ) : (
          <Typography color="red">Inativo</Typography>
        ),
    },
    {
      field: "createdBy",
      headerName: "Criado por",
      flex: 1,
      renderCell: (params) => params.row.createdBy?.name || "Desconhecido",
    },
    {
      field: "createdAt",
      headerName: "Criado em",
      flex: 0.8,
      renderCell: (params) =>
        params.row.createdAt
          ? new Date(params.row.createdAt).toLocaleDateString("pt-BR")
          : "-",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      flex: 1,
      getActions: (params) => [
        <GridActionsCellItem
          key="view"
          label="Visualizar"
          showInMenu
          onClick={() => handleView(params.row)}
        />,
        <GridActionsCellItem
          key="edit"
          label="Editar"
          showInMenu
          onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
          key="toggle"
          label={params.row.active ? "Desativar" : "Ativar"}
          showInMenu
          onClick={() => handleToggleActive(params.row)}
        />,
        <GridActionsCellItem
          key="delete"
          label="Excluir"
          showInMenu
          onClick={() => handleDelete(params.row)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Paper sx={{ padding: 4, borderRadius: 3, boxShadow: 3 }}>
        <Grid>
          <Typography variant="h5" mb={3}>
            Painel Cliente
          </Typography>
        </Grid>
        <Grid container spacing={2} alignItems="center" mb={2}>
          <Grid>
            <TextField
              label="Buscar"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>
          <Grid>
            <TextField
              select
              label="Status"
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              style={{ minWidth: 120 }}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="active">Ativos</MenuItem>
              <MenuItem value="inactive">Inativos</MenuItem>
            </TextField>
          </Grid>
          <Grid>
            <Button variant="contained" color="primary" onClick={handleAdd}>
              Novo Cliente
            </Button>
          </Grid>
        </Grid>

        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={filteredCustomers}
            columns={columns}
            getRowId={(row) => row.id}
          />
        </div>

        <CustomerModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initialData={editingCustomer}
          mode={mode}
        />

        <DeleteConfirmModal
          open={deleteConfirm}
          onClose={() => setDeleteConfirm(false)}
          onConfirm={confirmDelete}
          title="Confirmar exclusão"
          description={`Tem certeza que deseja excluir o cliente ${customerToDelete?.name}?`}
        />

        <SnackbarAlert
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </Paper>
    </Box>
  );
};

export default CustomerPage;
