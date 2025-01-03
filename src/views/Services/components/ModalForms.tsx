import { Modal } from "@/components/Modal/Modal";
import { useToastContext } from "@/hooks/useToast";
import { services } from "@/services/services";
import { IServices } from "@/types";
import { Help } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
const defaultValues = {
  price: "R$ 0" as any,
  porcentagem: "",
  name: "",
  description: "",
};

export const ModalForm = ({
  isOpen,
  onCloseModal,
  service,
  setParams,
}: {
  isOpen: boolean;
  onCloseModal: () => void;
  service: IServices;
  setParams: Dispatch<
    SetStateAction<{
      per_page: number;
      page: number;
      search: string;
    }>
  >;
}) => {
  const [checked, setChecked] = useState(true);
  const toast = useToastContext();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, control, reset } = useForm<IServices>();

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const onSubmit = async (data: IServices) => {
    const price = String(data.price).replace(/[^0-9]/g, ""); // Conversão explícita para número
    const newData = {
      ...data,
      porcentagem: data.porcentagem.replace(/[^0-9]/g, ""),
      price: +price, // Agora `price` é um número
    };
    setIsLoading(true);

    let response;

    if (service?.id) {
      response = await services.updateService(newData, service.id);
    } else {
      response = await services.createServices(newData);
    }
    setIsLoading(false);

    if (response.status === 201) {
      reset({ price: 0, porcentagem: "", name: "", description: "" });
      toast.success(response.data.message);
      setParams((old) => {
        const newOld = { ...old };
        return newOld;
      });
      onCloseModal();
    }
  };
  useEffect(() => {
    if (service?.id) {
      const value = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(service.price / 100);
      reset({ ...service, price: value as any, porcentagem: `${service.porcentagem} %` });
    }
  }, [service]);
  useEffect(() => {
    if (!service?.id) {
      reset(defaultValues);
    }
  }, [isOpen]);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCloseModal}
      title={!!service?.id ? "Editar Serviço" : "Criar Serviço"}
    >
      <Box
        component={"form"}
        onSubmit={handleSubmit(onSubmit)}
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
            <FormControl disabled={isLoading} fullWidth variant="outlined">
              <InputLabel htmlFor="outlined-adornment-percentage">
                Porcentagem
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-percentage"
                {...field}
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

        <Button
          type="submit"
          variant="contained"
          color="success"
          size="large"
          disabled={isLoading}
          fullWidth
        >
          {isLoading ? <CircularProgress size={20} /> : "Criar Serviço"}
        </Button>
      </Box>
    </Modal>
  );
};
