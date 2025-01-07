import { Heading, Text } from "@ignite-ui/react";
import Image from "next/image";
import previewImage from "../../assets/home.png";
import { NextSeo } from "next-seo";
import { Button, Divider } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { withAuth } from "@/hoc/withAuth";
import { Container, Hero, Preview } from "./styles";
import { ClaimUsernameForm } from "./components/ClaimUsernameForm/ClaimUsernameForm";
import { Form } from "./components/ClaimUsernameForm/styles";

export function Home() {
  const handleConnectCalendar = async () => {
    await signIn("google");
  };
  return (
    <>
      <NextSeo
        title="Descomplique sua agenda | Call"
        description="Conecte seu calendario e permita que as pessoas marquem agendamentos no seu tempo livre"
      />
      <Container>
        <Hero>
          <Heading size={"4xl"}>Agendamento descomplicado</Heading>
          <Text size={"xl"}>
            Conecte seu calendário e permita que as pessoas marquem agendamentos
            no seu tempo livre.
          </Text>

          <ClaimUsernameForm />

          <Divider
            sx={{
              my: 4,
            }}
          />
          <Form
            as="div"
            style={{
              background: "var(--colors-gray700)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p className="text-lg">Faça seu login com Google</p>

            <Button
              variant="contained"
              color="primary"
              onClick={handleConnectCalendar}
              sx={{
                minWidth: "100px",
              }}
            >
              <FcGoogle size={24} className="bg-white p-1  rounded-full" />
            </Button>
          </Form>
        </Hero>
        <Preview>
          <Image
            src={previewImage}
            height={400}
            priority
            quality={100}
            alt="Calendario sinbolizanfgo aplicação em funcionamento"
          />
        </Preview>
      </Container>
    </>
  );
}
