import { Avatar, Heading, Text } from "@ignite-ui/react";
import { NextSeo } from "next-seo";
import { ScheduleForm } from "./ScheduleForm";
import { UserHeader } from "./styles";
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Box, Link, Stack } from "@mui/material";
import { ArrowRight } from "phosphor-react";
import NextLink from "next/link";
import { useAuthContext } from "@/hooks/useAuth";
import { IsLoadingCompoenent } from "@/components/IsLoadingComponent";
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

      <Box
        maxWidth={852}
        py={0}
        px={{
          md: "14px",
          xs: 0,
        }}
        mt={{
          md: "3rem",
          xs: "6rem",
        }}
        mb={"1rem"}
        mx={"auto"}
      >
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
          <IsLoadingCompoenent />
        ) : (
          <>
            <UserHeader>
              <Avatar src={user?.avatar_url} alt={user?.name} />
              <Heading>{user?.name}</Heading>
              <Text
                style={{
                  textAlign: "center",
                }}
              >
                {user?.bio}
              </Text>
            </UserHeader>

            <ScheduleForm />
          </>
        )}
      </Box>
    </>
  );
}
