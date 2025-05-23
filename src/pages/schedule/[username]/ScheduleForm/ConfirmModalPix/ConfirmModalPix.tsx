import { Button, Text } from "@ignite-ui/react";
import { Dialog, Button as MuiButton } from "@mui/material";

export const ConfirmModalPix = ({
  showPixModal,
  setShowPixModal,
  handlePixPaymentConfirmed,
  isSubmitting,
}: {
  showPixModal: boolean;
  setShowPixModal: (showPixModal: boolean) => void;
  handlePixPaymentConfirmed: () => void;
  isSubmitting: boolean;
}) => {
  return (
    <Dialog
      open={showPixModal}
      onClose={() => setShowPixModal(false)}
      maxWidth="sm"
      fullWidth
    >
      <div
        style={{
          textAlign: "center",
          padding: "32px 24px",
          backgroundColor: "#fff",
          borderRadius: "8px",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <Text
            size="2xl"
            as="h2"
            style={{
              color: "#1E293B",
              marginBottom: "16px",
              fontWeight: "600",
            }}
          >
            Confirmação de Agendamento
          </Text>

          <Text
            size="md"
            style={{
              color: "#475569",
              marginBottom: "24px",
              lineHeight: "1.5",
            }}
          >
            Para garantir seu horário, é necessário realizar o pagamento via
            PIX.
          </Text>
        </div>

        <div
          style={{
            backgroundColor: "#FEF2F2",
            border: "1px solid #FEE2E2",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <Text
            size="sm"
            style={{
              color: "#E11D48",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "20px" }}>⚠️</span>

            <span>
              <strong>Importante:</strong> Você tem 15 minutos para realizar o
              pagamento. Após este período, sua reserva expirará
              automaticamente.
            </span>
          </Text>
        </div>

        <div
          style={{
            backgroundColor: "#F0FDF4",
            border: "1px solid #DCFCE7",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <Text
            size="sm"
            style={{
              color: "#166534",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <span style={{ fontSize: "20px" }}>💬</span>
            <span>
              <strong>Outras formas de pagamento:</strong> Caso prefira pagar de
              outra forma, entre em contato pelo WhatsApp.
            </span>
          </Text>
          <MuiButton
            variant="contained"
            color="success"
            onClick={() =>
              window.open(`https://wa.me/adicionar numero aqui`, "_blank")
            }
            style={{ minWidth: "200px" }}
            startIcon={<span style={{ fontSize: "20px" }}>📱</span>}
          >
            Falar no WhatsApp
          </MuiButton>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            marginTop: "24px",
          }}
        >
          <MuiButton
            variant="outlined"
            onClick={() => setShowPixModal(false)}
            style={{ minWidth: "120px" }}
          >
            Cancelar
          </MuiButton>
          <Button
            onClick={handlePixPaymentConfirmed}
            disabled={isSubmitting}
            style={{ minWidth: "160px" }}
          >
            Gerar QR Code PIX
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
