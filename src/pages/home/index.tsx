import { Heading, Text } from "@ignite-ui/react";
import Image from "next/image";
import { Container, Hero, Preview } from "./styles";
import previewImage from "../../assets/home.png";
import { ClaimUsernameForm } from "./components/ClaimUsernameForm/ClaimUsernameForm";
export default function Home() {
  return (
    <Container>
      <Hero>
        <Heading size={"4xl"}>Agendamento descomplicado</Heading>
        <Text size={"xl"}>
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre.
        </Text>

        <ClaimUsernameForm />
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
  );
}
