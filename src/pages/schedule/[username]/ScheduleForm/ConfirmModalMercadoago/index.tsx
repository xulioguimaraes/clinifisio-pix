import { useState } from "react";
import {
  Dialog,
  Button as MuiButton,
  CircularProgress,
  TextField,
  Box,
  Typography,
} from "@mui/material";
interface AgendamentoInfo {
  title: string;
  price: number;
  payer: {
    email: string;
    first_name: string;
    last_name: string;
    identification: { type: string; number: string };
  };
}

interface ConfirmModalMercadoPagoProps {
  showPixModal: boolean;
  setShowPixModal: (show: boolean) => void;
  agendamentoInfo: AgendamentoInfo;
}

export const ConfirmModalMercadoPago = ({
  showPixModal,
  setShowPixModal,
  agendamentoInfo,
}: ConfirmModalMercadoPagoProps) => {
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{
    qr_code_base64: string;
    qr_code: string;
    ticket_url: string;
  } | null>(null);

  const handlePixPayment = async () => {
    setLoading(true);
    setPixData(null);
    try {
      const res = await fetch("/api/mercadopago-pix.api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agendamentoInfo),
      });
      const data = await res.json();
      setPixData(data);
    } catch (e) {
      alert("Erro ao gerar pagamento Pix");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={showPixModal}
      onClose={() => setShowPixModal(false)}
      maxWidth="sm"
      fullWidth
    >
      <Box sx={{ textAlign: "center", p: 4, bgcolor: "#fff", borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Confirmação de Agendamento
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Para garantir seu horário, realize o pagamento via Pix.
        </Typography>
        {!pixData ? (
          <MuiButton
            onClick={handlePixPayment}
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Gerando Pix..." : "Gerar Pix"}
          </MuiButton>
        ) : (
          <Box>
            <Typography sx={{ mb: 2, color: "#166534" }}>
              Escaneie o QR Code ou copie o código Pix:
            </Typography>
            <img
              src={`data:image/jpeg;base64,${pixData.qr_code_base64}`}
              alt="QR Code Pix"
              style={{ width: 200, margin: "0 auto 16px" }}
            />
            <TextField
              value={pixData?.qr_code}
              fullWidth
              InputProps={{ readOnly: true }}
              label="Pix Copia e Cola"
              sx={{ mb: 2 }}
            />
            <MuiButton
              href={pixData.ticket_url}
              target="_blank"
              rel="noopener"
              variant="outlined"
              color="success"
              sx={{ mb: 2 }}
            >
              Abrir página do pagamento
            </MuiButton>
            <Typography variant="body2" sx={{ color: "#E11D48" }}>
              Após o pagamento, seu agendamento será confirmado automaticamente.
            </Typography>
          </Box>
        )}
        <MuiButton
          variant="text"
          onClick={() => setShowPixModal(false)}
          sx={{ mt: 2 }}
        >
          Fechar
        </MuiButton>
      </Box>
    </Dialog>
  );
};
