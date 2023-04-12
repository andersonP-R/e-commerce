import { useState, useEffect } from "react";
import NextLink from "next/link";
import { GetServerSideProps } from "next";
import { getSession, signIn, getProviders } from "next-auth/react";

import {
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  Link,
  Chip,
  Divider,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { AuthLayout } from "@/components/layouts";
import { validations } from "@/utils";
import { useRouter } from "next/router";
import { LoginSlideshow, LogoMiddle } from "@/components/ui";
import { MdErrorOutline } from "react-icons/md";

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { query, asPath } = useRouter();
  const [showError, setShowError] = useState(false);
  const [providers, setProviders] = useState<any>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // useEffect(() => {
  //   getProviders().then((provider) => {
  //     setProviders(provider);
  //   });
  // }, []);

  useEffect(() => {
    if (asPath.includes("error")) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  }, [asPath]);

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false);

    await signIn("credentials", { email, password });
  };

  return (
    <AuthLayout title="Ingresar">
      <form onSubmit={handleSubmit(onLoginUser)}>
        <Box
          sx={{
            width: 380,
            padding: "10px 40px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} mb={4}>
              <LogoMiddle />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h1" mb={1}>
                Iniciar sesión
              </Typography>
              <Chip
                label="No reconocemos el usuario / contraseña"
                color="error"
                icon={<MdErrorOutline />}
                className="fadeIn"
                sx={{ display: showError ? "flex" : "none" }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type="email"
                label="Correo"
                variant="filled"
                fullWidth
                {...register("email", {
                  required: "Este campo es requerido",
                  // reutilizamos la función de validación de form en el backend
                  validate: validations.isEmail,
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            {/*  */}
            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                type="password"
                variant="filled"
                fullWidth
                {...register("password", {
                  required: "Este campo es requerido",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" color="secondary" size="large" fullWidth>
                Ingresar
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="end">
              <NextLink
                href={
                  query.p ? `/auth/register?p=${query.p}` : "/auth/register"
                }
                passHref
                legacyBehavior
              >
                <Link underline="always">Registrarse</Link>
              </NextLink>
            </Grid>

            <Grid
              item
              xs={12}
              display="flex"
              flexDirection="column"
              justifyContent="end"
            >
              <Divider sx={{ width: "100%", mb: 2 }} />

              {/* transformamos el obj "Provider" a un array */}
              {/* {Object.values(providers).map((provider: any) => {
                // borramos el provedor Credentials.
                if (provider.id === "credentials") {
                  return <div key="credentials"></div>;
                }

                return (
                  <Button
                    key={provider.id}
                    variant="outlined"
                    fullWidth
                    color="primary"
                    sx={{ mb: 1 }}
                    onClick={() => signIn(provider.id)}
                  >
                    {provider.name}
                  </Button>
                );
              })} */}
            </Grid>
          </Grid>
        </Box>
      </form>

      <LoginSlideshow />
    </AuthLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req });
  const { p = "/" } = query;

  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default LoginPage;
