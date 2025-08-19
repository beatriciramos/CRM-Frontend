import {
  AppBar,
  Toolbar,
  IconButton,
  Switch,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import {
  Language as LanguageIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useThemeContext } from "../../context/ThemeContext";

const NavItem = styled(NavLink)`
  color: white;
  text-decoration: none;
  margin-right: 20px;
  position: relative;
  font-weight: 500;

  &:hover {
    color: #fd7e14;
  }

  &.active {
    &::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 3px;
      background-color: #fd7e14;
      bottom: -4px;
      left: 0;
      border-radius: 2px;
    }
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const { toggleTheme, mode } = useThemeContext();
  const [openLogout, setOpenLogout] = useState(false);

  if (!user) return null;

  const confirmLogout = () => {
    logout();
    setOpenLogout(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            CRM Simplificado
          </Typography>

          {user.role === "ADMIN" ||
            (user.role === "SELLER" && (
              <NavItem to="/admin">Administrativo</NavItem>
            ))}
          <NavItem to="/customers">Clientes</NavItem>
          <NavItem to="/attendances">Atendimentos</NavItem>
          <NavItem to="/profile">Perfil</NavItem>

          <Switch
            checked={mode === "dark"}
            onChange={toggleTheme}
            color="default"
          />

          <IconButton color="inherit">
            <LanguageIcon />
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {mode === "dark" ? "PT" : "PT"}
            </Typography>
          </IconButton>

          <IconButton color="inherit" onClick={() => setOpenLogout(true)}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Dialog de confirmação de logout */}
      <Dialog open={openLogout} onClose={() => setOpenLogout(false)}>
        <DialogTitle>Deseja realmente sair?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenLogout(false)}>Cancelar</Button>
          <Button onClick={confirmLogout} color="error">
            Sair
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
