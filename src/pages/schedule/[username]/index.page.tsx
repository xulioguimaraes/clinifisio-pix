import { Avatar, Heading, Text } from "@ignite-ui/react";
import { NextSeo } from "next-seo";
import { ScheduleForm } from "./ScheduleForm";
import { Container, UserHeader } from "./styles";
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Box, CircularProgress, Link, Stack, Typography } from "@mui/material";
import { ArrowRight } from "phosphor-react";
import NextLink from "next/link";
import { useAuthContext } from "@/hooks/useAuth";
interface ScheduleProps {
  user: {
    name: string;
    bio: string;
    avatarUrl: string;
  };
}

export default function Schedule({}: ScheduleProps) {
  const router = useRouter();
  const { username } = router.query;
  const { isAuth } = useAuthContext();
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      const response = await api.get(`/users/${username}/get`);
      return response.data;
    },
    enabled: !!username,
  });

  return (
    <>
      <NextSeo
        title={`${
          user?.name ? `Agendar com ${user?.name} | ` : ""
        } Agendamento`}
      />

      <Container>
        {isAuth && (
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <Link
              sx={{
                textDecoration: "underline",
              }}
              component={NextLink}
              display={"flex"}
              gap={1}
              alignItems={"center"}
              href="/painel"
              onClick={(e) => {
                e.preventDefault();
                router.push("/painel");
              }}
            >
              Ir para Painel
              <ArrowRight />
            </Link>
          </Stack>
        )}
        {isLoading ? (
          <Box
            width={"100%"}
            height={"100vh"}
            display={"flex"}
            justifyContent={"center"}
            flexDirection={"column"}
            gap={2}
            alignItems={"center"}
          >
            <CircularProgress />
            <Typography>Carregando...</Typography>
          </Box>
        ) : (
          <>
            <UserHeader>
              <Avatar src={user?.avatar_url} alt={user?.name} />
              <Heading>{user?.name}</Heading>
              <Text>{user?.bio}</Text>
            </UserHeader>

            <ScheduleForm />
          </>
        )}
      </Container>
    </>
  );
}
