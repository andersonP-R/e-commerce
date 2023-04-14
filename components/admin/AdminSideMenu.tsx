import { useRouter } from "next/router";
import NextLink from "next/link";
import {
  Box,
  Divider,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { LogoSmall } from "../ui";
import {
  MdOutlineHome,
  MdListAlt,
  MdProductionQuantityLimits,
  MdSupervisorAccount,
} from "react-icons/md";
import { IconContext } from "react-icons";

export const AdminSideMenu = () => {
  const router = useRouter();

  const navigateTo = (url: string) => router.push(url);

  return (
    <Box
      sx={{
        width: "250px",
        minHeight: "100vh",
        display: { xs: "none", sm: "block" },
        position: "relative",
        background: "#09287e",
      }}
    >
      <IconContext.Provider
        value={{ style: { color: "#ddd", fontSize: "1.8rem" } }}
      >
        {/*  */}

        <List sx={{ color: "#ddd", position: "sticky", top: 0 }}>
          <ListItem>
            <NextLink href="/" passHref legacyBehavior>
              <Link display="flex" alignItems="center">
                <LogoSmall colorFill="#ddd" />
              </Link>
            </NextLink>
          </ListItem>

          <Divider />

          <ListItemButton onClick={() => navigateTo("/admin")}>
            <ListItemIcon>
              <MdOutlineHome />
            </ListItemIcon>
            <ListItemText primary={"Inicio"} />
          </ListItemButton>

          <ListItemButton onClick={() => navigateTo("/admin/products")}>
            <ListItemIcon>
              <MdProductionQuantityLimits />{" "}
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
              <MdSupervisorAccount />
            </ListItemIcon>
            <ListItemText primary={"Usuarios"} />
          </ListItemButton>
        </List>
      </IconContext.Provider>
    </Box>
  );
};
