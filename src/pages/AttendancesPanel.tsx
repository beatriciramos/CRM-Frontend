import {
  Button,
  TextField,
  MenuItem,
  Grid,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import api from "../api/api";
import { toast } from "react-toastify";
import AttendanceModal from "../components/ModalAttendance";
import React from "react";

const AttendancePage: React.FC = () => {
  const [attendances, setAttendances] = React.useState<any[]>([]);
  const [filteredAttendances, setFilteredAttendances] = React.useState<any[]>(
    []
  );
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"create" | "edit" | "view">(
    "create"
  );
  const [selectedAttendance, setSelectedAttendance] = React.useState<
    any | undefined
  >(undefined);

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [channelFilter, setChannelFilter] = React.useState("");

  React.useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = async () => {
    try {
      const { data } = await api.get("/attendances");
      const formatted = data.map((a: any) => ({
        ...a,
        customerName: a.customer?.name ?? "-",
        customerEmail: a.customer?.email ?? "-",
        userName: a.user?.name ?? "-",
        createdAtFormatted: a.createdAt
          ? new Date(a.createdAt).toLocaleDateString("pt-BR")
          : "-",
      }));
      setAttendances(formatted);
      setFilteredAttendances(formatted);
    } catch (err) {
      toast.error("Erro ao buscar atendimentos");
    }
  };

  React.useEffect(() => {
    let result = [...attendances];
    if (search) {
      result = result.filter(
        (a) =>
          a.subject.toLowerCase().includes(search.toLowerCase()) ||
          a.customerName.toLowerCase().includes(search.toLowerCase()) ||
          a.userName.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter) result = result.filter((a) => a.status === statusFilter);
    if (channelFilter)
      result = result.filter((a) => a.channel === channelFilter);
    setFilteredAttendances(result);
  }, [search, statusFilter, channelFilter, attendances]);

  const handleOpenModal = (
    mode: "create" | "edit" | "view",
    attendance?: any
  ) => {
    setModalMode(mode);
    setSelectedAttendance(attendance);
    setModalOpen(true);
  };

  const handleSave = async (attendance: any) => {
    try {
      if (modalMode === "edit") {
        await api.put(`/attendances/${attendance.id}`, attendance);
        toast.success("Atendimento atualizado!");
      } else {
        await api.post("/attendances", attendance);
        toast.success("Atendimento criado!");
      }
      setModalOpen(false);
      fetchAttendances();
    } catch (err) {
      toast.error("Erro ao salvar atendimento");
    }
  };

  const columns: GridColDef[] = [
    { field: "customerName", headerName: "Cliente", flex: 1 },
    { field: "customerEmail", headerName: "Email Cliente", flex: 1 },
    { field: "userName", headerName: "Responsável", flex: 1 },
    { field: "channel", headerName: "Canal", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "createdAtFormatted", headerName: "Criado em", flex: 1 },
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
          onClick={() => handleOpenModal("view", params.row)}
        />,
        <GridActionsCellItem
          key="edit"
          label="Editar"
          showInMenu
          onClick={() => handleOpenModal("edit", params.row)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Paper sx={{ padding: 4, borderRadius: 3, boxShadow: 3 }}>
        <Grid>
          <Typography variant="h5" mb={3}>
            Painel de Atendimento
          </Typography>
        </Grid>
        <Grid
          container
          spacing={2}
          alignItems="center"
          style={{ marginBottom: 16 }}
        >
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
              variant="outlined"
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ minWidth: 120 }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="OPEN">Aberto</MenuItem>
              <MenuItem value="IN_PROGRESS">Em andamento</MenuItem>
              <MenuItem value="CLOSED">Fechado</MenuItem>
            </TextField>
          </Grid>
          <Grid>
            <TextField
              select
              label="Canal"
              variant="outlined"
              size="small"
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              style={{ minWidth: 120 }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="CALL">Ligação</MenuItem>
              <MenuItem value="EMAIL">Email</MenuItem>
              <MenuItem value="CHAT">Chat</MenuItem>
            </TextField>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenModal("create")}
            >
              Novo Atendimento
            </Button>
          </Grid>
        </Grid>

        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={filteredAttendances}
            columns={columns}
            getRowId={(row) => row.id}
          />
        </div>

        <AttendanceModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initialData={selectedAttendance}
          mode={modalMode}
        />
      </Paper>
    </Box>
  );
};

export default AttendancePage;
