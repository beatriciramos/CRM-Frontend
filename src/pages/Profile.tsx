import React from "react";
import { Box, Typography, Grid, Button, Paper } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <Box
      sx={{
        padding: 4,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          width: 400,
          padding: 4,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Meu Perfil
        </Typography>
        <Grid container spacing={2}>
          <Grid>
            <Typography>
              <strong>Nome:</strong> {user.name}
            </Typography>
          </Grid>
          <Grid>
            <Typography>
              <strong>Email:</strong> {user.email}
            </Typography>
          </Grid>
          <Grid>
            <Typography>
              <strong>Função:</strong> {user.role}
            </Typography>
          </Grid>
          {user.role === "ADMIN" && (
            <Grid>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => navigate("/admin")}
              >
                Painel de Admin
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
