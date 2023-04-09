import { useContext, useEffect, useState } from "react";
import NextLink from "next/link";

import { AppBar, Box, Button, Link, Toolbar } from "@mui/material";
import { UiContext } from "@/context";
import { LogoSmall } from "../ui";

export const AdminNavbar = () => {
  const { toggleSideMenu } = useContext(UiContext);
  const [isScroll, setIsScroll] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      window.pageYOffset > 50 ? setIsScroll(true) : setIsScroll(false);
    });
  }, [isScroll]);

  return (
    <AppBar
      sx={
        isScroll
          ? { boxShadow: "0px 5px 5px #fff" }
          : { boxShadow: "0px 5px 5px #ddd" }
      }
    >
      <Toolbar>
        <NextLink href="/" passHref legacyBehavior>
          <Link display="flex" alignItems="center">
            <LogoSmall />
          </Link>
        </NextLink>

        <Box flex={1} />

        <Button onClick={toggleSideMenu}>Menú</Button>
      </Toolbar>
    </AppBar>
  );
};
