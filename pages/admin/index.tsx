import { useState, useEffect } from "react";
import useSWR from "swr";

import { Box, Grid, Typography } from "@mui/material";
import { AdminLayout } from "@/components/layouts";
import { SummaryTitle } from "@/components/admin";
import { DashboardSummaryResponse } from "@/interfaces";
import {
  MdOutlineWorkspaces,
  MdSupervisorAccount,
  MdOutlineAssignmentTurnedIn,
  MdPendingActions,
  MdProductionQuantityLimits,
  MdOutlineInventory2,
  MdListAlt,
  MdSync,
} from "react-icons/md";
import { IconContext } from "react-icons";
import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";

const DashboardPage = () => {
  const { data, error } = useSWR<DashboardSummaryResponse>(
    "/api/admin/dashboard",
    {
      refreshInterval: 30 * 1000, // 30 segundos
    }
  );

  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn((refreshIn) => (refreshIn > 0 ? refreshIn - 1 : 30));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!error && !data) {
    return <></>;
  }

  if (error) {
    console.log(error);
    return <Typography>Error al cargar la información</Typography>;
  }

  const {
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
    notPaidOrders,
  } = data!;

  return (
    <AdminLayout titlePage="Estadísticas generales">
      <IconContext.Provider value={{ style: { fontSize: "3rem" } }}>
        <Grid container spacing={2}>
          <SummaryTitle
            title={numberOfOrders}
            subTitle="Ordenes totales"
            icon={
              <Box sx={{ color: "#000" }}>
                <MdListAlt />
              </Box>
            }
          />

          <SummaryTitle
            title={paidOrders}
            subTitle="Ordenes pagadas"
            icon={
              <Box sx={{ color: "#000" }}>
                <MdOutlineAssignmentTurnedIn />
              </Box>
            }
          />

          <SummaryTitle
            title={notPaidOrders}
            subTitle="Ordenes pendientes"
            icon={
              <Box sx={{ color: "#000" }}>
                <MdPendingActions />
              </Box>
            }
          />

          <SummaryTitle
            title={numberOfClients}
            subTitle="Clientes"
            icon={
              <Box sx={{ color: "#000" }}>
                <MdSupervisorAccount />
              </Box>
            }
          />

          <SummaryTitle
            title={numberOfProducts}
            subTitle="Productos"
            icon={
              <Box sx={{ color: "#000" }}>
                <MdOutlineWorkspaces />
              </Box>
            }
          />

          <SummaryTitle
            title={productsWithNoInventory}
            subTitle="Sin existencias"
            icon={
              <Box sx={{ color: "#000" }}>
                <MdProductionQuantityLimits />
              </Box>
            }
          />

          <SummaryTitle
            title={lowInventory}
            subTitle="Bajo inventario"
            icon={
              <Box sx={{ color: "#000" }}>
                <MdOutlineInventory2 />
              </Box>
            }
          />

          <SummaryTitle
            title={refreshIn}
            subTitle="Actualización en:"
            icon={
              <Box sx={{ color: "#000" }}>
                <MdSync />
              </Box>
            }
          />
        </Grid>
      </IconContext.Provider>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session: any = await getServerSession(req, res, authOptions);

  if (session?.user.role !== "admin") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default DashboardPage;
