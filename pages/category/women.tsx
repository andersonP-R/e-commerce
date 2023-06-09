import type { NextPage } from "next";
import { Typography } from "@mui/material";
import { useProducts } from "@/hooks";
import { ShopLayout } from "@/components/layouts";
import { FullScreenLoading } from "@/components/ui";
import { ProductList } from "@/components/products";

const WomenPage: NextPage = () => {
  const { products, isLoading } = useProducts("/products?gender=women");

  return (
    <ShopLayout
      title={"Teslo-Shop - Women"}
      pageDescription={"Encuentra los mejores productos de Teslo para ellas"}
    >
      <Typography variant="h1" component="h1" mb={2}>
        Mujeres
      </Typography>
      <Typography variant="h2" mb={1}>
        Productos para ellas
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default WomenPage;
