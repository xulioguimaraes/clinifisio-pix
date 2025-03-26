import { prisma } from "@/lib/prisma";
import { Avatar, Heading, Text } from "@ignite-ui/react";
import { GetServerSideProps, GetStaticPaths } from "next";
import { NextSeo } from "next-seo";
import { ScheduleForm } from "./ScheduleForm";
import { Container, UserHeader } from "./styles";
import { api } from "@/services/api";
interface ScheduleProps {
  user: {
    name: string;
    bio: string;
    avatarUrl: string;
  };
}

export default function Schedule({ user }: ScheduleProps) {
  return (
    <>
      <NextSeo title={`Agendar com ${user.name} | Call`} />

      <Container>
        <UserHeader>
          <Avatar src={user?.avatarUrl} alt={user?.name} />
          <Heading>{user.name}</Heading>
          <Text>{user.bio}</Text>
        </UserHeader>

        <ScheduleForm />
      </Container>
    </>
  );
}
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetServerSideProps = async ({ params }) => {
  const username = String(params?.username);

  const { data: user } = await api.get(`/users/${username}/get`);

  if (!user) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },
   // revalidate: 60 * 60 * 24, // 24horas
  };
};
