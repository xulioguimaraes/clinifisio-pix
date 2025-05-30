import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Text, TextArea, TextInput } from "@ignite-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { CalendarBlank, Clock } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ConfirmForm, FormActions, FormError, FormHeader } from "./styles";
import { useState } from "react";
import { IServices } from "@/types";
import { useToastContext } from "@/hooks/useToast";
import { users } from "@/services/users";
import { ConfirmModalPix } from "../ConfirmModalPix/ConfirmModalPix";

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
});

type ConfirmFormData = z.infer<typeof confirmFormSchema>;

interface ConfirmStepProps {
  schedulingDate: Date;
  onCancelConfitmation: () => void;
  service: IServices;
}

export const ConfrimStep = ({
  schedulingDate,
  onCancelConfitmation,
  service,
}: ConfirmStepProps) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmFormSchema),
  });
  const router = useRouter();
  const username = String(router.query.username);

  const [showPixModal, setShowPixModal] = useState(false);

  const handleConfirmSheduling = async (data: ConfirmFormData) => {
    try {
      setShowPixModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const describedDate = dayjs(schedulingDate).format("DD[ de ]MMMM[ de ]YYYY");
  const describedTime = dayjs(schedulingDate).format("HH:mm[h]");

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

      {/* Modal de confirmação do Mercado Pago Checkout Pro */}
      <ConfirmModalPix
        showPixModal={showPixModal}
        setShowPixModal={setShowPixModal}
        isSubmitting={isSubmitting}
        agendamentoInfo={{
          serviceId: service.id!,
        }}
      />
    </>
  );
};
