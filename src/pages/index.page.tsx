import { withAuth } from "@/hoc/withAuth";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { styled } from "@mui/material/styles";
import Image from "next/image";

const StyledContainer = styled(Container)({
  maxWidth: "calc(100vw - (100vw - 1160px) / 2)",
  display: "flex",
  alignItems: "center",
  height: "100vh",
  justifyContent: "center",
  gap: "80px",
  marginLeft: "auto",
});

const Hero = styled(Box)({
  width: 600,
  padding: "0 40px",
});

function AuthChoice() {
  const router = useRouter();

  return (
    <StyledContainer>
      <Hero>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Paper
            elevation={3}
            sx={{
              bgcolor: "background.paper",
              borderRadius: 2,
              height: 180,
              display: "flex",
              overflow: "hidden",
              flexDirection: "column",
              alignItems: "center",
              width: "fit-content",
            }}
          >
            <Image
              src="/images/logo-dra-tainan.jpeg"
              alt="Logo Dra Tainan Caroline"
              width={400}
              height={200}
              style={{ maxWidth: "100%", height: "auto" }}
              priority
            />
          </Paper>
        </Box>

        {/* <Typography color="textSecondary" pt={2} component="h6" variant="subtitle2">
          Escolha como deseja acessar o sistema
        </Typography> */}
        <Typography
          variant="h5"
          align="center"
          sx={{ mt: 4, color: "text.primary" }}
        >
          Bem-vindo ao Centro Estético Clinifisio
        </Typography>
        <Box
          sx={{
            mt: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/login")}
            sx={{ py: 1.5, width: 300 }}
          >
            Entrar
          </Button>
          {/* <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => router.push("/register")}
            sx={{ py: 1.5 }}
          >
            Criar conta
          </Button> */}
        </Box>
      </Hero>
    </StyledContainer>
  );
}

export default withAuth(AuthChoice);
