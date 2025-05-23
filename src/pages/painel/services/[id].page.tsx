import { IsLoadingCompoenent } from "@/components/IsLoadingComponent";
import { withAuth } from "@/hoc/withAuth";
import { services } from "@/services/services";
import { supabase } from "@/services/supabase";
import { Edit } from "@/views/Services/Edit";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

export async function getServerSideProps(context: { params: { id: any } }) {
  // Extrai o ID da URL (ex: /servicos/123 → id = "123")
  const { id } = context.params;
  let data = null;

  return {
    props: {
      id,
    },
  };
}

function EditServices({ id }: { id: any }) {
  const { data, isLoading } = useQuery([id], async () => {
    let data;
    if (id !== "new") {
      data = await services.getService(id);
    }
    return data?.data || {};
  });

  if (isLoading) {
    return <IsLoadingCompoenent />;
  }

  return (
    <>
      <Edit service={data.data} />
    </>
  );
}
export default withAuth(EditServices);
