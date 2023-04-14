import { FC, PropsWithChildren } from "react";
import Head from "next/head";
import { Box, Divider, Typography } from "@mui/material";
import { AdminNavbar, AdminSideMenu } from "../admin";

interface Props {
  icon?: JSX.Element;
  titlePage: string;
}

export const AdminLayout: FC<PropsWithChildren<Props>> = ({
  children,
  titlePage,
}) => {
  return (
    <>
      <Head>
        <title>{titlePage}</title>
      </Head>

      <Box display="flex">
        {/* sidemenu */}
        <AdminSideMenu />

        {/* principal content */}
        <Box
          sx={{
            width: { xs: "100%", sm: "calc(100% - 250px)" },
            backgroundColor: "#eee",
          }}
        >
          <AdminNavbar />
          <Box p={2}>
            <Typography variant="h1">{titlePage}</Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box
            sx={{
              p: 2,
              height: "calc(100vh - 80px)",
              overflowY: "scroll",
              scrollbarWidth: "thin",
              m: 2,
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </>
  );
};
