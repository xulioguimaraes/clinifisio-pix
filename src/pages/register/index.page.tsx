import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { AxiosError } from "axios";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { ArrowRight } from "phosphor-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Container, Form, FormError, Header } from "./styles";
import { api } from "@/services/api";

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "O usuário precisa ter pelo menos 3 letras.",
    })
    .regex(/^([a-z\\-]+)$/i, {
      message: "O v pode ter apenas letras e hifens",
    })
    .transform((value) => value.toLowerCase()),
  name: z.string().min(3, {
    message: "O nome precisa ter pelo menos 3 letras.",
  }),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });
  const router = useRouter();

  useEffect(() => {
    if (router.query.username) {
      setValue("username", String(router.query.username));
    }
  }, [router.query?.username, setValue]);
  const handleRegister = async (data: RegisterFormData) => {
    try {
      await api.post("/users", {
        name: data.name,
        username: data.username,
      });
      await router.push("/register/connect-calendar");
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data.message) {
        alert(err.response.data.message);
        return;
      }
      console.log(err);
    }
  };
  return (
    <>
      <NextSeo title="Crie uma conta | Call" />
      <Container>
        <Header>
          <Heading as="strong">Bem-vindo ao Call</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil!, Ah, você
            pode editar essas informações depois.
          </Text>

          <MultiStep size={4} currentStep={1} />
        </Header>
        <Form as="form" onSubmit={handleSubmit(handleRegister)}>
          <label>
            <Text size={"sm"}>Nome de usuário</Text>
            <TextInput
              prefix="ignite.com/"
              placeholder="seu-usuario"
              {...register("username")}
            />

            {errors.username && (
              <FormError size="sm">{errors.username.message}</FormError>
            )}
          </label>
          <label>
            <Text size={"sm"}>Nome de usuário</Text>
            <TextInput placeholder="Seu nome" {...register("name")} />
            {errors.name && (
              <FormError size="sm">{errors.name.message}</FormError>
            )}
          </label>
          <Button type="submit" disabled={isSubmitting}>
            Próximo passo
            <ArrowRight />
          </Button>
        </Form>
      </Container>
    </>
  );
}
