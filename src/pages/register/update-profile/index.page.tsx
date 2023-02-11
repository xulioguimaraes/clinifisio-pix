import { buildNextAuthOption } from "@/pages/api/auth/[...nextauth].api";
import { FormAnnotation } from "@/pages/home/components/ClaimUsernameForm/styles";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
  TextInput,
} from "@ignite-ui/react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Container, Form, FormError, Header } from "../styles";
import { ProfileBox } from "./styles";

const updateProfileSchema = z.object({
  bio: z.string(),
});

type UpdateProfileData = z.infer<typeof updateProfileSchema>;

export default function UpdateProfile() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  });
  const session = useSession();

  const handleUpdateProfile = async (data: UpdateProfileData) => {};
  return (
    <Container>
      <Header>
        <Heading as="strong">Bem-vindo ao Call</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil!, Ah, você
          pode editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={1} />
      </Header>
      <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
        <label>
          <Text size={"sm"}>Foto de perfil</Text>
          <Avatar
            src={session.data?.user.avatar_url}
            alt={session.data?.user.name}
          />
        </label>
        <label>
          <Text size={"sm"}>Sobre você</Text>
          <TextArea {...register("bio")} />
          <FormAnnotation>
            Fale um pouco sobre você. Isto será exibido em sua pagina pessoal.
          </FormAnnotation>
        </label>
        <Button type="submit" disabled={isSubmitting}>
          Finalizar
          <ArrowRight />
        </Button>
      </ProfileBox>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOption(req, res)
  );
  return {
    props: {
      session,
    },
  };
};
