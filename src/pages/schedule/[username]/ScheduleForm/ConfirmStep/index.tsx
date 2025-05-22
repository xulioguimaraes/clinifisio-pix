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
import { Dialog } from "@mui/material";

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
  console.log(service);
  const router = useRouter();
  const username = String(router.query.username);
  const toast = useToastContext();
  const [showPixModal, setShowPixModal] = useState(false);
  const [formData, setFormData] = useState<ConfirmFormData | null>(null);

  const handleConfirmSheduling = async (data: ConfirmFormData) => {
    try {
      // Mostra o modal do PIX primeiro
      setFormData(data);
      setShowPixModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePixPaymentConfirmed = async () => {
    if (!formData) return;

    try {
      const { email, name, observations, phone } = formData;

      const response = await users.confirmSheduling(username, {
        name,
        email,
        observations: observations!,
        phone,
        date: schedulingDate,
        id_service: service.id!,
      });

      if (response?.status === 201) {
        toast.success(response.data.message);
        onCancelConfitmation();
      }
    } catch (error) {
      console.log(error);
      toast.error("Ocorreu um erro ao confirmar o agendamento");
    } finally {
      setShowPixModal(false);
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

      {/* Modal de confirmação do PIX */}
      {showPixModal && (
        <Dialog open={showPixModal} onClose={() => setShowPixModal(false)}>
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Text size="xl" as="h2">
              Pagamento via PIX
            </Text>

            <div style={{ margin: "20px 0" }}>
              {/* Aqui você colocaria o componente do QR Code */}
              <div
                style={{
                  width: "200px",
                  height: "200px",
                  margin: "0 auto",
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                }}
              >
                <Text>[QR Code aqui]</Text>
              </div>

              <Text size="sm" style={{ marginTop: "10px" }}>
                Valor: R$ 100
              </Text>
            </div>

            <Text size="sm" style={{ marginBottom: "20px" }}>
              Escaneie o QR Code acima para realizar o pagamento via PIX e
              confirmar seu agendamento.
            </Text>

            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <Button variant="tertiary" onClick={() => setShowPixModal(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handlePixPaymentConfirmed}
                disabled={isSubmitting}
              >
                Já efetuei o pagamento
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};
