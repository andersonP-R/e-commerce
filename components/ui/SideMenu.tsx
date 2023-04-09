import { useContext, useState } from "react";
import { useRouter } from "next/router";

import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import {
  MdOutlineSearch,
  MdLogin,
  MdLogout,
  MdOutlineAccountCircle,
  MdOutlineDashboard,
  MdSupervisorAccount,
  MdOutlineWorkspaces,
  MdOutlineChildCare,
  MdOutlineFemale,
  MdMale,
  MdListAlt,
} from "react-icons/md";
import { IconContext } from "react-icons";

import { AuthContext, UiContext } from "@/context";
import { LogoSmall } from "./LogoSmall";

export const SideMenu = () => {
  const router = useRouter();
  const { isMenuOpen, toggleSideMenu } = useContext(UiContext);
  const { user, isLoggedIn, logoutUser } = useContext(AuthContext);

  const [searchTerm, setSearchTerm] = useState("");

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    navigateTo(`/search/${searchTerm}`);
  };

  const navigateTo = (url: string) => {
    toggleSideMenu();
    router.push(url);
  };

  return (
    <Drawer
      open={isMenuOpen}
      anchor="right"
      sx={{ backdropFilter: "blur(4px)", transition: "all 0.5s ease-out" }}
      onClose={toggleSideMenu}
    >
      <IconContext.Provider
        value={{ style: { fontSize: "1.4rem", color: "#000" } }}
      >
        <Box
          sx={{
            width: 250,
            height: "100vh",
            paddingTop: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <List>
            <ListItem>
              <Input
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => (e.key === "Enter" ? onSearchTerm() : null)}
                type="text"
                placeholder="Buscar..."
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={onSearchTerm}>
                      <MdOutlineSearch />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </ListItem>

            {isLoggedIn && (
              <>
                <ListItemButton>
                  <ListItemIcon>
                    <MdOutlineAccountCircle />
                  </ListItemIcon>
                  <ListItemText primary={"Perfil"} />
                </ListItemButton>
                <ListItemButton onClick={() => navigateTo("/orders/history")}>
                  <ListItemIcon>
                    <MdListAlt />
                  </ListItemIcon>
                  <ListItemText primary={"Mis Ordenes"} />
                </ListItemButton>
              </>
            )}

            <ListItemButton
              sx={{ display: { xs: "", sm: "none" } }}
              onClick={() => navigateTo("/category/men")}
            >
              <ListItemIcon>{<MdMale />}</ListItemIcon>
              <ListItemText primary={"Hombres"} />
            </ListItemButton>

            <ListItemButton
              sx={{ display: { xs: "", sm: "none" } }}
              onClick={() => navigateTo("/category/women")}
            >
              <ListItemIcon>
                {" "}
                <MdOutlineFemale />{" "}
              </ListItemIcon>
              <ListItemText primary={"Mujeres"} />
            </ListItemButton>

            <ListItemButton
              sx={{ display: { xs: "", sm: "none" } }}
              onClick={() => navigateTo("/category/kid")}
            >
              <ListItemIcon>
                <MdOutlineChildCare />{" "}
              </ListItemIcon>
              <ListItemText primary={"Niños"} />
            </ListItemButton>

            {isLoggedIn ? (
              <ListItemButton onClick={logoutUser}>
                <ListItemIcon>
                  <MdLogout />
                </ListItemIcon>
                <ListItemText primary={"Salir"} />
              </ListItemButton>
            ) : (
              <ListItemButton
                onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)}
              >
                <ListItemIcon>
                  <MdLogin />
                </ListItemIcon>
                <ListItemText primary={"Ingresar"} />
              </ListItemButton>
            )}

            {/* Admin */}
            {user?.role === "admin" && (
              <>
                <Divider />
                <ListSubheader>Admin Panel</ListSubheader>

                <ListItemButton onClick={() => navigateTo("/admin/")}>
                  <ListItemIcon>
                    <MdOutlineDashboard />{" "}
                  </ListItemIcon>
                  <ListItemText primary={"Dashboard"} />
                </ListItemButton>

                <ListItemButton onClick={() => navigateTo("/admin/products")}>
                  <ListItemIcon>
                    <MdOutlineWorkspaces />{" "}
                  </ListItemIcon>
                  <ListItemText primary={"Productos"} />
                </ListItemButton>
                <ListItemButton onClick={() => navigateTo("/admin/orders")}>
                  <ListItemIcon>
                    <MdListAlt />
                  </ListItemIcon>
                  <ListItemText primary={"Ordenes"} />
                </ListItemButton>

                <ListItemButton onClick={() => navigateTo("/admin/users")}>
                  <ListItemIcon>
                    {" "}
                    <MdSupervisorAccount />{" "}
                  </ListItemIcon>
                  <ListItemText primary={"Usuarios"} />
                </ListItemButton>
              </>
            )}
          </List>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <LogoSmall />
            <Box sx={{ mb: 2, fontSize: 12 }}>
              Todos los derechos reservados
            </Box>
          </Box>
        </Box>
      </IconContext.Provider>
    </Drawer>
  );
};
