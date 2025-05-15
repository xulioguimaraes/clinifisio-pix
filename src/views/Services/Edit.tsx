import { Modal } from "@/components/Modal/Modal";
import { useToastContext } from "@/hooks/useToast";
import { services } from "@/services/services";
import { IServices } from "@/types";
import { Close, Help } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
const defaultValues = {
  price: "R$ 0" as any,
  porcentagem: "",
  name: "",
  description: "",
};
import { serialize } from "object-to-formdata";
import { useRouter } from "next/router";

export const Edit = ({ service }: { service: any }) => {
  const [checked, setChecked] = useState(true);
  const toast = useToastContext();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, control, reset } = useForm<IServices>({
    defaultValues: {
      porcentagem: "0",
    },
  });
  const [images, setImages] = useState<Array<{ url: string; file?: File }>>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].url); // Libera a URL da memória
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const clearAllImages = () => {
    images.forEach((image) => URL.revokeObjectURL(image.url)); // Limpa todas as URLs
    setImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reseta o input de arquivo
    }
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const onSubmit = async (data: IServices) => {
    const price = String(data.price).replace(/[^0-9]/g, "");

    // Adicionamos os dados do formulário
    const newData = {
      ...data,
      active: checked,
      porcentagem: !!data.porcentagem
        ? data.porcentagem.replace(/[^0-9]/g, "")
        : 0,
      price: +price,
      images: images.map((img) => img.file), // Adiciona as imagens ao formulário
    };
    const formData = serialize(newData, {
      indices: true,
      booleansAsIntegers: true,
    });
    setIsLoading(true);

    try {
      let response;
      const config = {
        headers: {
          "Content-Type": "multipart/form-data", // Importante para o backend reconhecer
        },
      };

      if (service?.id) {
        response = await services.updateService(formData, service.id, config);
      } else {
        response = await services.createServices(formData, config);
      }

      if (response.status === 201 || response.status === 200) {
        router.push("/painel/services");
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Erro ao enviar imagens");
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (service?.id) {
      const value = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(service.price / 100);
      reset({
        ...service,
        price: value as any,
        porcentagem: `${service.porcentagem} %`,
      });
      handleChange({
        target: {
          checked: service.active,
        },
      } as any);

      // Se o serviço já tiver imagens, carregue-as
      if (service.images && service.images.length > 0) {
        setImages(service.images.map((img: string) => ({ url: img })));
      }
    }

    // Limpeza ao desmontar o componente
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.url));
    };
  }, [service]);

  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
      p={1}
      className="flex flex-col gap-2"
    >
      <div className="flex gap-2 items-center">
        <Switch
          checked={checked}
          onChange={handleChange}
          color="success"
          inputProps={{ "aria-label": "controlled" }}
        />
        {checked ? <p>Ativo</p> : <p>Inativo</p>}
      </div>
      <Box>
        <Typography variant="h6" gutterBottom>
          Imagens do Serviço
        </Typography>

        {/* Input para múltiplas imagens */}
        <input
          ref={fileInputRef}
          accept="image/*"
          type="file"
          multiple
          onChange={handleImageChange}
          style={{ display: "none" }}
          id="upload-images"
        />
        <label htmlFor="upload-images">
          <Button variant="outlined" component="span" color="warning">
            Adicionar Imagens
          </Button>
        </label>

        {images.length > 0 && (
          <Button
            variant="text"
            color="error"
            onClick={clearAllImages}
            sx={{ ml: 2 }}
          >
            Limpar Todas
          </Button>
        )}

        {/* Preview das imagens */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
          {images.map((image, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                width: 100,
                height: 100,
                borderRadius: 1,
                overflow: "hidden",
                cursor: "pointer",
                "&:hover": {
                  boxShadow: 3,
                },
              }}
              onClick={() => openImageModal(image.url)}
            >
              <img
                src={image.url}
                alt={`Preview ${index}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.7)",
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>
      <TextField
        {...register("name", { required: true })}
        label="Nome"
        fullWidth
        disabled={isLoading}
        placeholder="Nome do serviço"
      />
      <Controller
        name="price"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            {...field}
            onChange={(e) => {
              const value = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(e.target.value.replace(/[^0-9]/g, "")) / 100);
              field.onChange(value);
            }}
            label="Preço"
            fullWidth
            disabled={isLoading}
            placeholder="Preço do serviço"
          />
        )}
      />

      <TextField
        fullWidth
        label="Descrição"
        {...register("description")}
        placeholder="Descrição do serviço"
        multiline
        disabled={isLoading}
        rows={4}
      />
      <Controller
        control={control}
        name="porcentagem"
        render={({ field }) => (
          <FormControl
            sx={{
              display: "none",
            }}
            disabled={isLoading}
            fullWidth
            variant="outlined"
          >
            <InputLabel htmlFor="outlined-adornment-percentage">
              Porcentagem
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-percentage"
              {...field}
              defaultValue={"0 %"}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^0-9]/g, ""); // Remove caracteres não numéricos
                let numericValue = Number(rawValue); // Converte para número

                // Limita o valor entre 0 e 100
                if (numericValue > 100) numericValue = 100;
                if (numericValue < 0) numericValue = 0;

                const percentage = `${numericValue}%`; // Formata como porcentagem
                field.onChange(percentage); // Atualiza o valor do campo
              }}
              value={field.value} // Exibe o valor formatado com "%"
              type="text"
              endAdornment={
                <InputAdornment position="end">
                  <Tooltip title="Ajuda sobre porcentagem">
                    <IconButton aria-label="help">
                      <Help />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              }
              label="Porcentagem"
            />
          </FormControl>
        )}
      />

      <Dialog open={!!selectedImage} onClose={closeImageModal} maxWidth="md">
        <DialogTitle>Visualização da Imagem</DialogTitle>
        <DialogContent>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Imagem em tamanho maior"
              style={{ width: "100%", height: "auto" }}
            />
          )}
        </DialogContent>
      </Dialog>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Button
          onClick={() => router.push("/painel/services")}
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="success"
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={22} />
          ) : service?.id ? (
            "Atualizar Serviço"
          ) : (
            "Criar Serviço"
          )}
        </Button>
      </Stack>
    </Box>
  );
};
