import { useContext, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";

import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Input,
  InputAdornment,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import { CartContext, UiContext } from "@/context";
import { MdShoppingCart, MdOutlineSearch, MdClose } from "react-icons/md";
import { IconContext } from "react-icons";

export const Navbar = () => {
  const { asPath, push } = useRouter();
  const { toggleSideMenu } = useContext(UiContext);
  const { numberOfItems } = useContext(CartContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    push(`/search/${searchTerm}`);
  };

  return (
    <AppBar>
      <Toolbar>
        <IconContext.Provider
          value={{ style: { fontSize: "1.4rem", color: "#000" } }}
        >
          <NextLink href="/" passHref legacyBehavior>
            <Link display="flex" alignItems="center">
              <Typography variant="h6">Teslo |</Typography>
              <Typography sx={{ ml: 0.5 }}>Shop</Typography>
            </Link>
          </NextLink>

          <Box flex={1} />

          <Box
            sx={{
              display: isSearchVisible ? "none" : { xs: "none", sm: "block" },
            }}
            className="fadeIn"
          >
            <NextLink href="/category/men" passHref legacyBehavior>
              <Link mr={1}>
                <Button color={asPath === "/category/men" ? "primary" : "info"}>
                  Hombres
                </Button>
              </Link>
            </NextLink>
            <NextLink href="/category/women" passHref legacyBehavior>
              <Link mr={1}>
                <Button
                  color={asPath === "/category/women" ? "primary" : "info"}
                >
                  Mujeres
                </Button>
              </Link>
            </NextLink>
            <NextLink href="/category/kid" passHref legacyBehavior>
              <Link mr={1}>
                <Button color={asPath === "/category/kid" ? "primary" : "info"}>
                  Niños
                </Button>
              </Link>
            </NextLink>
          </Box>

          <Box flex={1} />

          {/* Pantallas pantallas grandes */}
          {isSearchVisible ? (
            <Input
              sx={{ display: { xs: "none", sm: "flex" } }}
              className="fadeIn"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => (e.key === "Enter" ? onSearchTerm() : null)}
              type="text"
              placeholder="Buscar..."
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => setIsSearchVisible(false)}>
                    <MdClose />
                  </IconButton>
                </InputAdornment>
              }
            />
          ) : (
            <IconButton
              onClick={() => setIsSearchVisible(true)}
              className="fadeIn"
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <MdOutlineSearch />
            </IconButton>
          )}

          {/* Pantallas pequeñas */}
          <IconButton
            sx={{ display: { xs: "flex", sm: "none" } }}
            onClick={toggleSideMenu}
          >
            <MdOutlineSearch />
          </IconButton>

          <NextLink href="/cart" passHref legacyBehavior>
            <Link>
              <IconButton>
                <Badge
                  badgeContent={numberOfItems > 9 ? "+9" : numberOfItems}
                  color="secondary"
                >
                  <MdShoppingCart />
                </Badge>
              </IconButton>
            </Link>
          </NextLink>

          <Button onClick={toggleSideMenu}>Menú</Button>
        </IconContext.Provider>
      </Toolbar>
    </AppBar>
  );
};
