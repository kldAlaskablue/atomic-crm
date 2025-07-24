import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import {
  Business,
  Category,
  People,
  Settings
} from '@mui/icons-material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import {
  CanAccess,
  LoadingIndicator,
  Logout,
  UserMenu,
  useUserMenu
} from 'react-admin';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { useConfigurationContext } from '../root/ConfigurationContext';
import { useUsuarioLogadoInfo } from '../hooks/useUsuarioLogado';
import { RefreshIdentityMenu } from './useUserMenu';

const Header = () => {
  const { logo, title, companySectors, dealCategories } = useConfigurationContext();
  const location = useLocation();
  const usuario = useUsuarioLogadoInfo();

  // Tabs controller
  const path = location.pathname;
  const currentPath =
    matchPath('/', path) ? '/' :
    matchPath('/contacts/*', path) ? '/contacts' :
    matchPath('/companies/*', path) ? '/companies' :
    matchPath('/deals/*', path) ? '/deals' :
    false;

  // Dropdown controllers
  const [anchorSector, setAnchorSector] = useState<null | HTMLElement>(null);
  const [anchorCategory, setAnchorCategory] = useState<null | HTMLElement>(null);

  const openSector = (e: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorSector(e.currentTarget);
  const openCategory = (e: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorCategory(e.currentTarget);
  const closeMenus = () => {
    setAnchorSector(null);
    setAnchorCategory(null);
  };

  return (
    <Box component="nav" sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar variant="dense">
          <Box flex={1} display="flex" justifyContent="space-between">

            {/* Logo + Título */}
            <Box
              display="flex"
              alignItems="center"
              component={Link}
              to="/"
              sx={{ color: 'inherit', textDecoration: 'inherit' }}
              gap={1.5}
            >
              <Box component="img" sx={{ height: 24 }} src={logo} alt={title} />
              <Typography component="span" variant="h5">{title}</Typography>
            </Box>

            {/* Navegação principal */}
            <Box display="flex" alignItems="center" gap={2}>
              <Tabs
                value={currentPath}
                aria-label="Navegação"
                indicatorColor="secondary"
                textColor="inherit"
              >
                <Tab label="Dashboard" component={Link} to="/" value="/" />
                <Tab label="Template" component={Link} to="/templates" value="/templates" />
                {/* <Tab label="Contatos" component={Link} to="/contacts" value="/contacts" />
                <Tab label="Empresas" component={Link} to="/companies" value="/companies" />
                <Tab label="Negócios" component={Link} to="/deals" value="/deals" /> */}
              </Tabs>

              {/* Menus comentados: Setores e Categorias */}
              {/* Você pode reativá-los quando quiser */}
            </Box>

            {/* Área do usuário */}
            <Box display="flex" alignItems="center" gap={1}>
              <LoadingIndicator />

              <UserMenu
                label={usuario?.fullName}
                icon={
                  usuario?.avatar ? (
                    <Avatar
                      src={usuario.avatar}
                      alt={usuario.fullName}
                      sx={{ width: 32, height: 32 }}
                    />
                  ) : (
                    <AccountCircle />
                  )
                }
              >
                <ConfigurationMenu />
                <CanAccess resource="sales" action="list">
                  <UsersMenu />
                </CanAccess>
                <Logout />
              </UserMenu>

              <RefreshIdentityMenu />
            </Box>

          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

// Menu: Configurações
const ConfigurationMenu = () => {
  const { onClose } = useUserMenu() ?? {};
  return (
    <MenuItem component={Link} to="/settings" onClick={onClose}>
      <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
      <ListItemText>Minhas informações</ListItemText>
    </MenuItem>
  );
};

// Menu: Usuários
const UsersMenu = () => {
  const { onClose } = useUserMenu() ?? {};
  return (
    <MenuItem component={Link} to="/sales" onClick={onClose}>
      <ListItemIcon><People fontSize="small" /></ListItemIcon>
      <ListItemText>Usuários</ListItemText>
    </MenuItem>
  );
};

export default Header;