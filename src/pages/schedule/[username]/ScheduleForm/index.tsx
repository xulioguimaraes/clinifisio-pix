import { useEffect, useState } from "react";
import { CalendarStep } from "./CalendarStep";
import { ConfrimStep } from "./ConfirmStep";
import { ServicesStep } from "./ServicesStep";
import { useRouter } from "next/router";
import { users } from "@/services/users";
import { useToastContext } from "@/hooks/useToast";
import { IServices } from "@/types";

export const ScheduleForm = () => {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>();
  const [selectedService, setSelectedService] = useState<IServices | null>(
    {} as IServices
  );
  const [stepSelect, setStepSelect] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [listServices, setListServices] = useState([]);
  const router = useRouter();
  const toast = useToastContext();
  const username = String(router.query.username);

  const handleBackStepService = () => {
    setStepSelect(1);
    setSelectedDateTime(null);
    setSelectedService(null);
  };
  const getServicesUser = async () => {
    setIsLoading(true);
    const response = await users.getServicesUser(username);
    setIsLoading(false);

    if (response.status === 200) {
      setListServices(response.data);
    } else {
      toast.error("Erro ao buscar serviços");
    }
  };
  useEffect(() => {
    getServicesUser();
  }, []);

  const handleSelectService = (service: IServices) => {
    setSelectedService(service);
    setStepSelect(3);
  };

  return (
    <>
      {stepSelect === 1 && (
        <CalendarStep
          onSelectDateTime={(date) => {
            setSelectedDateTime(date);
            setStepSelect(2);
          }}
        />
      )}
      {stepSelect === 2 && (
        <ServicesStep
          schedulingDate={selectedDateTime!}
          data={listServices}
          handleSelectService={handleSelectService}
          handleBackStepService={handleBackStepService}
        />
      )}
      {stepSelect === 3 && (
        <ConfrimStep
          schedulingDate={selectedDateTime!}
          service={selectedService!}
          onCancelConfitmation={handleBackStepService}
        />
      )}
    </>
  );
};
