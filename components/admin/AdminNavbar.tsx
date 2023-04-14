import { useContext, useState } from "react";

import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { AuthContext, UiContext } from "@/context";
import { MdOutlineAccountCircle } from "react-icons/md";

export const AdminNavbar = () => {
  const { toggleSideMenu } = useContext(UiContext);
  const { user } = useContext(AuthContext);

  return (
    <AppBar
      sx={{
        height: "80px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        position: "relative",
        background: "#eee",
        boxShadow: "0px 5px 5px #00000049",
      }}
    >
      <Toolbar>
        <Box sx={{ fontSize: "3rem", pt: 2, color: "#0d3ca0" }}>
          <MdOutlineAccountCircle />
        </Box>

        <Box sx={{ ml: 1 }}>
          <Typography variant="subtitle1" color="#000">
            {user?.name}
          </Typography>
        </Box>

        <Box flex={1} />

        <Button onClick={toggleSideMenu}>Menú</Button>
      </Toolbar>
    </AppBar>
  );
};
