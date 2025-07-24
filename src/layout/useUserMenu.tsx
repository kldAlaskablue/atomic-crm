import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { Settings } from "lucide-react";
import { useUserMenu } from "react-admin";

export const RefreshIdentityMenu = () => {
  const { onClose } = useUserMenu() ?? {};
  return (
    <MenuItem
      onClick={() => {
        window.location.reload(); // força reload, atualiza identidade
        onClose?.();
      }}
    >
      <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
      <ListItemText>Recarregar identidade</ListItemText>
    </MenuItem>
  );
};