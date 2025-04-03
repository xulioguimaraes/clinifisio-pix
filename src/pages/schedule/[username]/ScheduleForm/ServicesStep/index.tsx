import { ArrowLeft, CalendarBlank, Clock } from "phosphor-react";
import dayjs from "dayjs";
import { IServices } from "@/types";
import { Button, Link, Typography } from "@mui/material";
import { useAuthContext } from "@/hooks/useAuth";
import NextLink from "next/link";

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
              <>
                <button
                  key={item.id}
                  onClick={() => handleSelectService(item)}
                  className="md:flex  bg-[#323238] justify-between items-center py-2 px-4 border border-gray-700 rounded-lg"
                >
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
                </button>
              </>
            );
          })
        )}

        <Button onClick={handleBackStepService} variant="outlined">
          Voltar
        </Button>
      </div>
    </div>
  );
};
