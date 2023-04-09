import type { NextPage } from "next";
import { Typography } from "@mui/material";
import { useProducts } from "../hooks";
import { ShopLayout } from "@/components/layouts";

import { ProductList } from "../components/products";
import { FullScreenLoading } from "../components/ui";

const HomePage: NextPage = () => {
  const { products, isLoading } = useProducts("/products");

  return (
    <ShopLayout
      title={"Teslo-Shop - Home"}
      pageDescription={"Encuentra los mejores productos de Teslo aquí"}
    >
      <Typography variant="h1" component="h1" mb={2}>
        Tienda
      </Typography>
      <Typography variant="h2" mb={1}>
        Todos los productos
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default HomePage;
