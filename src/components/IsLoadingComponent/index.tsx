import { Box, CircularProgress, Typography } from "@mui/material";

export const IsLoadingCompoenent = () => {
  return (
    <Box
      width={"100%"}
      height={"calc(100vh - 90px)"}
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      gap={2}
      alignItems={"center"}
    >
      <CircularProgress />
      <Typography>Carregando...</Typography>
    </Box>
  );
};
