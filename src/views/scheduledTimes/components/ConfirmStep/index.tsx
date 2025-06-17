import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Text, TextArea, TextInput } from "@ignite-ui/react";
import dayjs from "dayjs";

import { CalendarBlank, Clock } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ConfirmForm, FormActions, FormError, FormHeader } from "./styles";

import { IServices } from "@/types";
import { MenuItem, Select } from "@mui/material";

const confirmFormSchema = z.object({
  name: z.string().min(3, {
    message: "O nome precisa no mínimo 3 caracteres",
  }),
  email: z.string().email({
    message: "Digite um email valido",
  }),
  phone: z.string().min(11, {
    message: "Digite um telefone valido",
  }),
  observations: z.string().nullable(),
  service: z.string().min(1, {
    message: "Selecione um serviço",
  }),
});

type ConfirmFormData = z.infer<typeof confirmFormSchema>;

interface ConfirmStepProps {
  schedulingDate: {
    date: string;
    hour: number;
  };
  onCancelConfitmation: () => void;
  service: IServices[];
}

export const ConfrimStep = ({
  schedulingDate,
  onCancelConfitmation,
  service = [],
}: ConfirmStepProps) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmFormSchema),
  });

  const handleConfirmSheduling = async (data: ConfirmFormData) => {
    console.log(data);
  };

  const describedDate = dayjs(schedulingDate.date).format(
    "DD[ de ]MMMM[ de ]YYYY"
  );
  const describedTime = `${schedulingDate.hour}:00h`;

  return (
    <>
      <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmSheduling)}>
        <FormHeader>
          <Text>
            <CalendarBlank />
            {describedDate}
          </Text>
          <Text>
            <Clock />
            {describedTime}
          </Text>
        </FormHeader>
        <label>
          <Text size="sm">Serviço</Text>
          <Select
            sx={{
              bgcolor: "#121214",
              borderRadius: "6px",
              "& .MuiSelect-select": {
                p: "0.75rem 1rem",
              },
            }}
            size="small"
            displayEmpty
            {...register("service")}
            defaultValue=""
          >
            <MenuItem value="" disabled>
              Selecione um serviço
            </MenuItem>
            {service.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
          {errors.service && <FormError>{errors.service.message}</FormError>}
        </label>
        <label>
          <Text size="sm">Nome completo</Text>
          <TextInput placeholder="Seu nome" {...register("name")} />
          {errors.name && <FormError>{errors.name.message}</FormError>}
        </label>

        <label>
          <Text size="sm">Email</Text>
          <TextInput
            type={"email"}
            placeholder="john@gmail.com"
            {...register("email")}
          />
          {errors.email && <FormError>{errors.email.message}</FormError>}
        </label>
        <label>
          <Text size="sm">Telefone</Text>
          <TextInput
            type={"number"}
            placeholder="(99) 99999-9999"
            {...register("phone")}
          />
          {errors.phone && <FormError>{errors.phone.message}</FormError>}
        </label>
        <label>
          <Text size="sm">Observações</Text>
          <TextArea {...register("observations")} />
        </label>
        <FormActions>
          <Button
            onClick={onCancelConfitmation}
            type="button"
            variant={"tertiary"}
          >
            Cancelar
          </Button>
          <Button disabled={isSubmitting} type="submit">
            Confirmar
          </Button>
        </FormActions>
      </ConfirmForm>
    </>
  );
};
