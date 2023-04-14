import { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  Chip,
} from "@mui/material";
import { IOrder } from "@/interfaces";
import { AdminLayout } from "@/components/layouts";
import { CartList, OrderSummary } from "@/components/cart";
import { dbOrders } from "@/database";
import { MdCreditCard, MdCreditCardOff } from "react-icons/md";
import { IconContext } from "react-icons";

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const { shippingAddress } = order;

  return (
    <AdminLayout titlePage={`Orden: ${order._id}`}>
      <IconContext.Provider value={{ style: { fontSize: "1.4rem" } }}>
        {order.isPaid ? (
          <Chip
            sx={{ my: 2, p: 2 }}
            label="Orden ya fue pagada"
            variant="outlined"
            color="success"
            icon={<MdCreditCard />}
          />
        ) : (
          <Chip
            sx={{ my: 2, p: 2 }}
            label="Pendiente de pago"
            variant="outlined"
            color="error"
            icon={<MdCreditCardOff />}
          />
        )}

        <Grid container className="fadeIn">
          <Grid item xs={12} sm={7}>
            <CartList products={order.orderItems} />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Card className="summary-card">
              <CardContent>
                <Typography variant="h2">
                  Resumen ({order.numberOfItems}{" "}
                  {order.numberOfItems > 1 ? "productos" : "producto"})
                </Typography>
                <Divider sx={{ my: 1 }} />

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle1">
                    Dirección de entrega
                  </Typography>
                </Box>

                <Typography>
                  {shippingAddress.firstName} {shippingAddress.lastName}
                </Typography>
                <Typography>
                  {shippingAddress.address}{" "}
                  {shippingAddress.address2
                    ? `, ${shippingAddress.address2}`
                    : ""}
                </Typography>
                <Typography>
                  {shippingAddress.city}, {shippingAddress.zip}
                </Typography>
                <Typography>{shippingAddress.country}</Typography>
                <Typography>{shippingAddress.phone}</Typography>

                <Divider sx={{ my: 1 }} />

                <OrderSummary
                  orderValues={{
                    numberOfItems: order.numberOfItems,
                    subTotal: order.subTotal,
                    total: order.total,
                    tax: order.tax,
                  }}
                />

                <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                  <Box display="flex" flexDirection="column">
                    {order.isPaid ? (
                      <Chip
                        sx={{ my: 2, flex: 1, p: 1 }}
                        label="Orden ya fue pagada"
                        variant="outlined"
                        color="success"
                        icon={<MdCreditCard />}
                      />
                    ) : (
                      <Chip
                        sx={{ my: 2, flex: 1, p: 1 }}
                        label="Pendiente de pago"
                        variant="outlined"
                        color="error"
                        icon={<MdCreditCardOff />}
                      />
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </IconContext.Provider>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  res,
}) => {
  const { id = "" } = query;
  const order = await dbOrders.getOrderById(id.toString());
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (session.user.role !== "admin") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!order) {
    return {
      redirect: {
        destination: "/admin/orders",
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
