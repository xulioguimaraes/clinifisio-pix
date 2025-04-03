import Image from "next/image";
import previewImage from "../../assets/home.png";
import { NextSeo } from "next-seo";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { Container, Hero, Preview } from "./styles";
import { ClaimUsernameForm } from "./components/ClaimUsernameForm/ClaimUsernameForm";
import { Form } from "./components/ClaimUsernameForm/styles";
import { useState } from "react";

export function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnectCalendar = async () => {
    setIsLoading(true);
    await signIn("google");
  };

  return (
    <>
      <NextSeo
        title="Agende suas reuniões com facilidade | Agendamento"
        description="Conecte seu calendário e compartilhe sua disponibilidade com facilidade."
      />
      <Container>
        <Hero>
          <Typography component={"h1"} variant="h2" fontWeight={600}>
            Organize seus agendamentos
          </Typography>
          <Typography
            color="textSecondary"
            pt={2}
            component={"h6"}
            variant="subtitle2"
          >
            Compartilhe sua agenda e deixe que outras pessoas escolham horários
            disponíveis.
          </Typography>

          <ClaimUsernameForm />

          <Divider sx={{ my: 4 }} />

          <Form
            as="div"
            style={{
              background: "var(--colors-gray700)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography className="text-lg">
              Já possui conta? Acesse com sua conta Google e acesse seus dados.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              type="button"
              fullWidth
              disabled={isLoading}
              onClick={handleConnectCalendar}
              sx={{ minWidth: "100px" }}
            >
              {isLoading ? (
                <CircularProgress size={22} />
              ) : (
                <Box
                  sx={{
                    background: "white",
                  }}
                  p={'2px'}
                  borderRadius={999}
                >
                  <FcGoogle size={28} className="bg-white p-1 rounded-full" />
                </Box>
              )}
            </Button>
          </Form>
        </Hero>
        <Preview>
          <Image
            src={previewImage}
            height={400}
            priority
            quality={100}
            alt="Exemplo de agendamento no calendário"
          />
        </Preview>
      </Container>
    </>
  );
}
