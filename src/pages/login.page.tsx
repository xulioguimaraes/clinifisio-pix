import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";

import { signIn } from "next-auth/react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
  CircularProgress,
} from "@mui/material";
import { supabase } from "@/services/supabase";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<LoginFormData>();

  async function handleLogin(data: LoginFormData) {
    try {
      setIsLoading(true);
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (authData.user) {
        // Sign in with NextAuth
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          setError(result.error);
          return;
        }

        router.push("/painel");
      }
    } catch (error) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            bgcolor: "background.paper",
            borderRadius: 2,
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            align="center"
            gutterBottom
            sx={{ mb: 3 }}
          >
            Entrar no sistema
          </Typography>

          <Box component="form" onSubmit={handleSubmit(handleLogin)}>
            <TextField
              {...register("email")}
              margin="dense"
              size="small"
              required
              fullWidth
              id="email"
              label="Email"
              autoComplete="email"
              autoFocus
              disabled={isLoading}
            />
            <TextField
              {...register("password")}
              margin="dense"
              size="small"
              required
              fullWidth
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              disabled={isLoading}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 1 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Entrar"
              )}
            </Button>

            {/* <Box sx={{ textAlign: "center" }}>
              <Link href="/register" passHref>
                <Button
                  component="a"
                  variant="text"
                  size="small"
                  sx={{ color: "primary.light" }}
                  disabled={isLoading}
                >
                  Não tem uma conta? Registre-se
                </Button>
              </Link>
            </Box> */}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
