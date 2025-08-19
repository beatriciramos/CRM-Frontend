import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import { toast } from "react-toastify";
import UserModal from "../components/ModalUser";
import { UserItemIProps } from "../utils/types/user";

const AdminPage: React.FC = () => {
  const { user, token } = useAuth();
  const [users, setUsers] = React.useState<UserItemIProps[]>([]);
  const [filteredUsers, setFilteredUsers] = React.useState<UserItemIProps[]>(
    []
  );
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<UserItemIProps | null>(
    null
  );

  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("");

  const isAdmin = user?.role === "ADMIN";

  React.useEffect(() => {
    fetchUsers();
  }, [user]);

  React.useEffect(() => {
    let result = [...users];
    if (search) {
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (roleFilter) result = result.filter((u) => u.role === roleFilter);
    setFilteredUsers(result);
  }, [search, roleFilter, users]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      toast.error("Erro ao buscar usuários");
    }
  };

  const handleAdd = () => {
    if (!isAdmin) return toast.error("Apenas ADMIN pode criar usuários");
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEdit = (userData: UserItemIProps) => {
    setEditingUser(userData);
    setModalOpen(true);
  };

  const handleSave = async (userData: Partial<UserItemIProps>) => {
    try {
      if (!isAdmin) return toast.error("Apenas ADMIN pode salvar usuários");

      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, userData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Usuário atualizado!");
      } else {
        await api.post("/users/register", userData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Usuário criado!");
      }
      setModalOpen(false);
      fetchUsers();
    } catch {
      toast.error("Erro ao salvar usuário");
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return toast.error("Apenas ADMIN pode deletar usuários");
    try {
      await api.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Usuário deletado!");
      fetchUsers();
    } catch {
      toast.error("Erro ao deletar usuário");
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Nome", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "role",
      headerName: "Função",
      flex: 1,
      renderCell: (params) =>
        params.row.role === "SELLER" ? "Vendedor" : "Administrador",
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
          onClick={() => handleEdit(params.row)}
        />,
        ...(isAdmin
          ? [
              <GridActionsCellItem
                key="edit"
                label="Editar"
                showInMenu
                onClick={() => handleEdit(params.row)}
              />,
              <GridActionsCellItem
                key="delete"
                label="Excluir"
                showInMenu
                onClick={() => handleDelete(params.row.id)}
              />,
            ]
          : []),
      ],
    },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Paper sx={{ padding: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" mb={3}>
          Painel Administrativo
        </Typography>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
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
              label="Função"
              variant="outlined"
              size="small"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ minWidth: 120 }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="SELLER">Vendedor</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </TextField>
          </Grid>
          {isAdmin && (
            <Grid>
              <Button variant="contained" color="primary" onClick={handleAdd}>
                Novo Usuário
              </Button>
            </Grid>
          )}
        </Grid>

        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            getRowId={(row) => row.id}
          />
        </div>
      </Paper>

      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingUser}
        readOnly={!isAdmin && editingUser !== null} // SELLER só visualiza
      />
    </Box>
  );
};
export default AdminPage;
