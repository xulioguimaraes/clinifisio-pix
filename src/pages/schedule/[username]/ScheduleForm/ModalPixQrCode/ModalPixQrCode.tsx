import { Button, Text } from "@ignite-ui/react";
import { Dialog, Button as MuiButton } from "@mui/material";
import { useEffect, useState } from "react";
import Image from "next/image";

export const ModalPixQrCode = ({
  showPixModal,
  setShowPixModal,
  qrCode,
  payloadPix,
}: {
  showPixModal: boolean;
  setShowPixModal: (showPixModal: boolean) => void;
  qrCode: string;
  payloadPix: string;
}) => {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!showPixModal) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setShowPixModal(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showPixModal, setShowPixModal]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(payloadPix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          padding: "16px 24px",
          backgroundColor: "#fff",
          borderRadius: "8px",
        }}
      >
        <div >
          <div
            style={{
              backgroundColor: "#FEF2F2",
              border: "1px solid #FEE2E2",
              borderRadius: "8px",
              padding: "8px 16px",
              marginBottom: "12px",
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
              <span style={{ fontSize: "20px" }}>⏰</span>
              <span>
                <strong>Tempo restante:</strong> {formatTime(timeLeft)}
              </span>
            </Text>
          </div>

          <div
            style={{
              backgroundColor: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "12px",
            }}
          >
            <div style={{ marginBottom: "8px" }}>
              <Image
                src={`data:image/png;base64,${qrCode}`}
                alt="QR Code PIX"
                width={200}
                height={200}
                style={{ margin: "0 auto" }}
              />
            </div>

            <div style={{ marginBottom: "8px" }}>
              <Text size="sm" style={{ color: "#475569",}}>
                Ou copie o código PIX abaixo:
              </Text>
              <div
                style={{
                  backgroundColor: "#F1F5F9",
                  padding: "12px",
                  borderRadius: "6px",
                  wordBreak: "break-all",
                  fontSize: "12px",
                  color: "#475569",
                  marginBottom: "8px",
                  maxHeight: "48px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {payloadPix}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    background:
                      "linear-gradient(90deg, transparent, #F1F5F9 50%)",
                    paddingLeft: "40px",
                    paddingTop: "20px",
                  }}
                >
                 
                </div>
              </div>
              <MuiButton
                variant="outlined"
                onClick={handleCopyPayload}
                style={{ minWidth: "160px" }}
              >
                {copied ? "Copiado!" : "Copiar código PIX"}
              </MuiButton>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#F0FDF4",
              border: "1px solid #DCFCE7",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "12px",
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
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "20px" }}>💬</span>
              <span>
                <strong>Outras formas de pagamento:</strong> Caso prefira pagar
                de outra forma, entre em contato pelo WhatsApp.
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
              marginTop: "12px",
            }}
          >
            <MuiButton
              variant="outlined"
              onClick={() => setShowPixModal(false)}
              style={{ minWidth: "120px" }}
            >
              Fechar
            </MuiButton>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
