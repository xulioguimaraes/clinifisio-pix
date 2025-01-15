import { withAuth } from "@/hoc/withAuth";
import { Box, Divider, Tab, Tabs } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import "dayjs/locale/pt-br"; // Importar o idioma Português do Brasil
import isoWeek from "dayjs/plugin/isoWeek";
import { users } from "@/services/users";
import { useSession } from "next-auth/react";
import { useToastContext } from "@/hooks/useToast";
dayjs.extend(isoWeek);
dayjs.locale("pt-br");
interface IAppointments {
  name: string;
  email: string;
  observations: string;
  phone: string;
  hours: number;
  service: {
    name: string;
  };
}
interface IWeekData {
  weekNumber: number;
  daysOfWeek: {
    date: string;
    dayName: string;
    blocked: boolean;
    hoursDay: number[];
    appointments: IAppointments[];
  }[];
  hoursdays: number[]; // Certifique-se que o nome da propriedade esteja correto
  monthName: string;
}
interface IAvailableTimes {
  weekAvailability: {
    availableTimes: number[];
    scheduledServices: IAppointments[];
  }[];
  uniqueAvailableTimes: number[];
}

function IntervalsTime() {
  const [value, setValue] = useState("one");
  const toast = useToastContext();
  const { data: session } = useSession();
  const [isLoadingBloacked, setIsLoadingBloacked] = useState(true);
  const [isLoadingAvailableTimes, setIsLoadingAvailableTimes] = useState(true);

  const [blockedDays, setBlockedDays] = useState<number[]>([]);
  const [availableTimes, setAvailableTimes] = useState<IAvailableTimes>(
    {} as IAvailableTimes
  );
  const getBlockedDays = async (params: { year: number; month: number }) => {
    setIsLoadingBloacked(true);
    const response = await users.getBlockedDays(
      session?.user.username!,
      params
    );
    if (response.status === 200) {
      setBlockedDays(response.data.blockedWeekDays);
    }
    setIsLoadingBloacked(false);
  };
  const getAvailableTimes = async (params: { startOfWeek: Date }) => {
    setIsLoadingAvailableTimes(true);
    const response = await users.getAvailableTimes(
      session?.user.username!,
      params
    );
    if (response.status === 200) {
      setAvailableTimes(response.data);
    }
    setIsLoadingAvailableTimes(false);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const getWeekDaysWithNamesAndWeekNumber = (
    referenceDate: string | Date = new Date()
  ) => {
    const startOfWeek = dayjs(referenceDate).startOf("week"); // Domingo
    const weekNumber = dayjs(referenceDate).isoWeek(); // Número da semana no ano

    const daysOfWeek = Array.from({ length: 7 }).map((_, index) => ({
      date: startOfWeek.add(index, "day").format("YYYY-MM-DD"),
      dayName: startOfWeek.add(index, "day").format("ddd"), // Nome do dia em português
      blocked: blockedDays.includes(index),
      hoursDay: availableTimes?.weekAvailability[index]?.availableTimes || [], // Verifique se availableTimes existe
      appointments: availableTimes?.weekAvailability[index]?.scheduledServices,
    }));

    return {
      weekNumber,
      daysOfWeek,
      hoursdays: availableTimes?.uniqueAvailableTimes || [], // Verifique se availableTimes existe
      monthName: dayjs(referenceDate).format("MMMM"),
    };
  };

  const [weekData, setWeekData] = useState<IWeekData>({} as IWeekData);

  useEffect(() => {
    if (
      !isLoadingBloacked &&
      !isLoadingAvailableTimes &&
      availableTimes?.weekAvailability?.length > 0
    ) {
      const today = new Date();

      setWeekData(getWeekDaysWithNamesAndWeekNumber(today));
    }
  }, [blockedDays, availableTimes]);
  const getInfoCalendar = async () => {
    try {
      const today = new Date();
      const year = dayjs(today).get("year");
      const month = dayjs(today).get("month");
      await Promise.all([
        getBlockedDays({ year, month }),
        getAvailableTimes({ startOfWeek: today }),
      ]);
    } catch (error: any) {
      toast.error(`Ocorreu um erro tente novamente:${error?.message}`);
      console.log(error);
    }
  };
  useEffect(() => {
    getInfoCalendar();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="wrapped label tabs example"
      >
        <Tab value="one" label="Semana" wrapped />
        <Tab value="two" label="Calendario" />
        <Tab value="three" label="Lista" />
      </Tabs>
      <div className="p-6 overflow-x-scroll ">
        {value === "one" && (
          <>
            <div className="">
              <div className="p-4 uppercase border border-gray-600 rounded-t-md bg-[#202024]">
                <h3>{weekData.monthName}</h3>
                <p>Semana: {weekData.weekNumber}</p>
              </div>
              <div className="grid bg-[#202024] grid-flow-col auto-cols-[163px] capitalize border border-gray-600 overflow-x-auto">
                {/* Coluna de Horas */}
                <div className="flex flex-col border-r border-t border-gray-600 mt-16">
                  {weekData.hoursdays?.map((hour) => (
                    <div
                      key={hour}
                      className="flex items-center justify-center h-12 border-b border-gray-600"
                    >
                      {`${String(hour).padStart(2, "0")}:00`}
                    </div>
                  ))}
                </div>
                {/* Colunas dos Dias */}
                {weekData.daysOfWeek?.map((day) => (
                  <div
                    key={day.date}
                    className={`border-r border-gray-600 ${
                      !day.blocked && "bg-[#323238]"
                    }`}
                  >
                    <div className="flex flex-col items-center py-2 border-b border-gray-600">
                      <strong>{day.dayName}</strong>
                      <p>{dayjs(day.date).format("DD/MM")}</p>
                    </div>
                    {weekData.hoursdays.map((hour) => (
                      <div
                        key={`${day.date}-${hour}`}
                        className={`flex items-center justify-center h-12 border-b border-gray-600 ${
                          !day.hoursDay.some(
                            (hourDay) => (hour === hourDay)
                          ) && "bg-[#202024]"
                        }`}
                      >
                        {}
                        {/* Verifica se há um agendamento para esse horário */}
                        {day.appointments?.find(
                          (appt) => +appt.hours === hour
                        ) ? (
                          <span className="bg-blue-200 text-black px-1 w-full mx-1 py-1 rounded-md text-sm">
                            {
                              day.appointments.find(
                                (appt) => +appt.hours === hour
                              )?.service?.name
                            }
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Box>
  );
}

export default withAuth(IntervalsTime);
