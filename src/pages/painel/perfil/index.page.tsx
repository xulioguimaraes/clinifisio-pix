import AvatarUpload from "@/components/Profile/components/AvatarUpload";
import { withAuth } from "@/hoc/withAuth";
import { useToastContext } from "@/hooks/useToast";
import { users } from "@/services/users";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/pt-br"; // Importar o idioma Português do Brasil
import { useState } from "react";
import { useForm } from "react-hook-form";

dayjs.locale("pt-br");
interface UserData {}

function IntervalsTime() {
  const { register, handleSubmit, reset } = useForm();
  const [isLoadingSubmit, setIsLoading] = useState(false);
  const toast = useToastContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data, isLoading } = useQuery(
    ["user-data"],
    async () => {
      const response = await users.getUserData();
      reset(response.data);
      return response.data;
    },

    { keepPreviousData: false }
  );
  const onSubmitData = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("bio", values.bio);
      formData.append("name", values.name);

      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }
      setIsLoading(true);
      const response = await users.updateUser(formData);
      setIsLoading(false);

      if (response.status === 204) {
        toast.success("Usuário atualizado");
      } else {
        toast.error("Erro ao atualizar informações");
      }
    } catch (error) {
      toast.error("Erro ao enviar os dados");
      console.error(error);
    }
  };
  const onFileSelect = (file: File) => {
    setSelectedFile(file);
  };
  return (
    <>
      {isLoading ? (
        <Box
          width={"100%"}
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
        <Stack
          spacing={2}
          component={"form"}
          onSubmit={handleSubmit(onSubmitData)}
        >
          <AvatarUpload
            avatarUrl={data?.avatar_url}
            onFileSelect={onFileSelect}
          />

          <Box
            gap={2}
            display={"grid"}
            gridTemplateColumns={{
              md: "1fr 1fr 1fr",
              xl: "1fr 1fr 1fr",
              xs: "1fr 1fr 1fr",
            }}
          >
            <TextField
              slotProps={{ inputLabel: { shrink: true } }}
              {...register("name")}
              label="Nome"
              fullWidth
            />

            <TextField
              label="E-mail"
              disabled
              fullWidth
              value={data?.email}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Nome unico de Usuario"
              disabled
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={data?.username}
            />
          </Box>
          <TextField
            {...register("bio")}
            label="Descrição"
            multiline
            rows={4}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Stack justifyContent={"end"} alignItems={"end"}>
            <Button
              sx={{
                minWidth: 112,
              }}
              disabled={isLoadingSubmit}
              variant="contained"
              type="submit"
            >
              {isLoadingSubmit ? <CircularProgress size={20} /> : "Salvar"}
            </Button>
          </Stack>
        </Stack>
      )}
    </>
  );
}

export default withAuth(IntervalsTime);
