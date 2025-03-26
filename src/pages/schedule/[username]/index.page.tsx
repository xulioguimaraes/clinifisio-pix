import { prisma } from "@/lib/prisma";
import { Avatar, Heading, Text } from "@ignite-ui/react";
import { GetServerSideProps, GetStaticPaths } from "next";
import { NextSeo } from "next-seo";
import { ScheduleForm } from "./ScheduleForm";
import { Container, UserHeader } from "./styles";
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Box, CircularProgress, Typography } from "@mui/material";
interface ScheduleProps {
  user: {
    name: string;
    bio: string;
    avatarUrl: string;
  };
}

interface DataProps {
  data: {
    name: string;
    bio: string;
    avatarUrl: string;
  };
}
export default function Schedule({}: ScheduleProps) {
  const router = useRouter();
  const { username } = router.query;
  const {
    data: user,
    isLoading,
    error,
  } = useQuery(["user"], async () => {
    const response = await api.get(`/users/${username}/get`);
    return response.data;
  });
  
  return (
    <>
      <NextSeo title={`Agendar com ${user?.name} | Call`} />

      <Container>
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
              <Avatar src={user?.avatarUrl} alt={user?.name} />
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


