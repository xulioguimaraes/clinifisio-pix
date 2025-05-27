import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  AlertTitle,
  Paper,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface RegisterFormData {
  name: string;
  email: string;
  username: string;
  password: string;
}

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<RegisterFormData>();

  async function handleRegister(data: RegisterFormData) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Falha no registro");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 5000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocorreu um erro durante o registro");
      }
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
            Criar conta
          </Typography>

          {success ? (
            <Alert severity="success" icon={<CheckCircleIcon />}>
              <AlertTitle>Conta criada com sucesso!</AlertTitle>
              Por favor, verifique seu email para confirmar sua conta. Você será
              redirecionado para a página de login em alguns segundos.
            </Alert>
          ) : (
            <Box component="form" onSubmit={handleSubmit(handleRegister)}>
              <TextField
                {...register("name")}
                margin="dense"
                size="small"
                required
                fullWidth
                id="name"
                label="Nome completo"
                autoComplete="name"
                autoFocus
                disabled={isLoading}
              />
              <TextField
                {...register("email")}
                margin="dense"
                size="small"
                required
                fullWidth
                id="email"
                label="Email"
                autoComplete="email"
                disabled={isLoading}
              />
              <TextField
                {...register("username")}
                margin="dense"
                size="small"
                required
                fullWidth
                id="username"
                label="Nome de usuário"
                autoComplete="username"
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
                autoComplete="new-password"
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
                  "Criar conta"
                )}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Link href="/login" passHref>
                  <Button
                    component="a"
                    variant="text"
                    size="small"
                    sx={{ color: "primary.light" }}
                    disabled={isLoading}
                  >
                    Já tem uma conta? Entre aqui
                  </Button>
                </Link>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
} 