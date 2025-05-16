import {
  ArrowLeft,
  CalendarBlank,
  Clock,
  X,
  CaretLeft,
  CaretRight,
} from "phosphor-react";
import dayjs from "dayjs";
import { IServices } from "@/types";
import {
  Box,
  Button,
  Link,
  Stack,
  Typography,
  Modal,
  IconButton,
} from "@mui/material";
import { useAuthContext } from "@/hooks/useAuth";
import NextLink from "next/link";
import Image from "next/image";
import { useState } from "react";

export const ServicesStep = ({
  schedulingDate,
  data = [],
  handleSelectService,
  handleBackStepService,
}: {
  schedulingDate: Date;
  data: any[];
  handleSelectService: (item: IServices) => void;
  handleBackStepService: () => void;
}) => {
  const describedDate = dayjs(schedulingDate).format("DD[ de ]MMMM[ de ]YYYY");
  const describedTime = dayjs(schedulingDate).format("HH:mm[h]");
  const notService = data.length === 0;
  const { isAuth } = useAuthContext();

  // Estado para controle do modal
  const [openModal, setOpenModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentServiceImages, setCurrentServiceImages] = useState<string[]>(
    []
  );

  // Abre o modal com as imagens do serviço
  const handleOpenGallery = (images: string[]) => {
    setCurrentServiceImages(images);
    setCurrentImageIndex(0);
    setOpenModal(true);
  };

  // Fecha o modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Navega entre as imagens
  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === currentServiceImages.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? currentServiceImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="flex flex-col gap-4 mt-4 max-w-[540px] border border-[#323238] rounded-md bg-[#202024] p-4 mx-auto">
      <div className="border-b border-gray-600 pb-4 flex gap-4">
        <button type="button" onClick={handleBackStepService}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <p className="text-sm">Serviços disponiveis para</p>
          <div className="flex gap-4">
            <p className="flex gap-2 items-center">
              <CalendarBlank />
              {describedDate}
            </p>
            <p className="flex gap-2 items-center">
              <Clock />
              {describedTime}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 max-h-[400px] overflow-auto">
        {notService ? (
          <>
            <Typography py={2} fontSize={24} textAlign={"center"}>
              Nenhum serviço disponivel
            </Typography>
            {isAuth && (
              <Link
                textAlign={"center"}
                href={"/painel/services"}
                component={NextLink}
              >
                Click aqui para cadastrar seus seriços
              </Link>
            )}
          </>
        ) : (
          data.map((item: IServices) => {
            return (
              <div key={item.id} className="relative">
                <button
                  onClick={() => handleSelectService(item)}
                  className="md:flex w-full bg-[#323238] justify-between items-center py-2  border border-gray-700 rounded-lg"
                >
                  <Stack
                    sx={{
                      px: {
                        md: 2,
                        xs: 1,
                      },
                    }}
                    spacing={1}
                    direction={"row"}
                  >
                    <Box
                      borderRadius={4}
                      overflow={"hidden"}
                      maxWidth={{ md: 100, xs: 70 }}
                      minWidth={{ md: 100, xs: 70 }}
                      maxHeight={{ md: 100, xs: 70 }}
                      width={"100%"}
                      height={"100%"}
                    >
                      {item?.images?.length === 0 ? (
                        <Image
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          src="/images/default.png"
                          alt="Imagem padrão"
                          width={100}
                          height={100}
                        />
                      ) : (
                        <Image
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          src={item?.images ? item?.images[0] : ""}
                          alt={item.name}
                          width={100}
                          height={100}
                        />
                      )}
                    </Box>
                    <Box>
                      <div>
                        <h3 className="text-lg text-left">{item.name}</h3>
                        <p className="text-gray-500 text-left">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex justify-end">
                        <strong className="text-xl text-end">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(item.price / 100)}
                        </strong>
                      </div>
                    </Box>
                  </Stack>
                </button>

                {/* Botão "Ver mais imagens" */}
                {!!item?.images && item?.images?.length > 1 && (
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      fontSize: "0.7rem",
                      padding: "2px 8px",
                      minWidth: "unset",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenGallery(!!item?.images ? item?.images : []);
                    }}
                  >
                    Ver mais ({item.images.length})
                  </Button>
                )}
              </div>
            );
          })
        )}

        <Button onClick={handleBackStepService} variant="outlined">
          Voltar
        </Button>
      </div>

      {/* Modal da Galeria */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="image-gallery-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "90%",
            maxWidth: "800px",
            maxHeight: "90vh",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 2,
            outline: "none",
          }}
        >
          {/* Botão de fechar */}
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              zIndex: 1,
              color: "white",
              bgcolor: "rgba(0,0,0,0.5)",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.7)",
              },
            }}
          >
            <X size={24} />
          </IconButton>

          {/* Imagem principal */}
          <Box
            sx={{
              width: "100%",
              height: "70vh",
              position: "relative",
              mb: 2,
            }}
          >
            <Image
              src={currentServiceImages[currentImageIndex]}
              alt={`Imagem ${currentImageIndex + 1}`}
              fill
              style={{
                objectFit: "contain",
              }}
            />

            {/* Navegação - Anterior */}
            {currentServiceImages.length > 1 && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                sx={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "white",
                  bgcolor: "rgba(0,0,0,0.5)",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.7)",
                  },
                }}
              >
                <CaretLeft size={32} />
              </IconButton>
            )}

            {/* Navegação - Próximo */}
            {currentServiceImages.length > 1 && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "white",
                  bgcolor: "rgba(0,0,0,0.5)",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.7)",
                  },
                }}
              >
                <CaretRight size={32} />
              </IconButton>
            )}
          </Box>

          {/* Miniaturas */}
          {currentServiceImages.length > 1 && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                overflowX: "auto",
                py: 1,
                px: 1,
              }}
            >
              {currentServiceImages.map((img, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  sx={{
                    width: 80,
                    height: 80,
                    position: "relative",
                    cursor: "pointer",
                    border:
                      index === currentImageIndex
                        ? "2px solid #1976d2"
                        : "1px solid #ddd",
                    borderRadius: 1,
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Modal>
    </div>
  );
};
