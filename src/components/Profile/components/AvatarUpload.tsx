import { useState } from "react";
import { Avatar, Box, Typography } from "@mui/material";

interface AvatarUploadProps {
  avatarUrl?: string;
  onFileSelect: (file: File) => void;
}

export default function AvatarUpload({
  avatarUrl,
  onFileSelect,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(avatarUrl || null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // Gera URL para pré-visualização
      onFileSelect(file);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: 130,
        height: 130,
        borderRadius: "50%",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={() => document.getElementById("avatarInput")?.click()}
    >
      <Avatar
        sx={{ width: "100%", height: "100%" }}
        src={preview || avatarUrl}
      />

      <input
        id="avatarInput"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "14px",
          fontWeight: "bold",
          opacity: 0,
          transition: "opacity 0.3s",
          "&:hover": { opacity: 1 },
        }}
      >
        <Typography>Mudar Imagem</Typography>
      </Box>
    </Box>
  );
}
