import { useToastContext } from "@/hooks/useToast";
import { users } from "@/services/users";
import { IAvailableTimes, IWeekData } from "@/types";
import { Box, Skeleton } from "@mui/material";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Scheduling } from "./Scheduling";
import { HeaderCalendarWeek } from "./HeaderCalendarWeek";
import { useScheduling } from "../hooks/useScheduling";

export const TabWeeks = ({ value }: { value: "one" }) => {
  const toast = useToastContext();
  const { data: session } = useSession();
  const [isLoadingBloacked, setIsLoadingBloacked] = useState(true);
  const { setToday, today } = useScheduling();
  const [isLoadingAvailableTimes, setIsLoadingAvailableTimes] = useState(true);
  const [blockedDays, setBlockedDays] = useState<number[]>([]);

  const [weekData, setWeekData] = useState<IWeekData>({} as IWeekData);

  const [dateWeeks, setDateWeeks] = useState<
    { date: string; monthName: string; weekNumber: number }[]
  >([]);
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
  const getAvailableTimes = async (params: { startOfWeek: string }) => {
    setIsLoadingAvailableTimes(true);
    const response = await users.getAvailableTimes(
      session?.user.username!,
      params
    );
    if (response.status === 200) {
      console.log(response.data);
      setAvailableTimes(response.data);
    }
    setIsLoadingAvailableTimes(false);
  };
  const getDaysName = (dateRefence: string) => {
    const startOfWeek = dayjs(dateRefence).startOf("week"); // Domingo
    setDateWeeks(
      Array.from({ length: 7 }).map((_, index) => ({
        date: startOfWeek.add(index, "day").format("YYYY-MM-DD"),
        monthName: dayjs(dateRefence).format("MMMM"),
        weekNumber: dayjs(dateRefence).isoWeek(),
      }))
    );
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

  const isLoadingAll = !(
    !isLoadingBloacked &&
    !isLoadingAvailableTimes &&
    availableTimes?.weekAvailability?.length > 0
  );

  useEffect(() => {
    if (
      !isLoadingBloacked &&
      !isLoadingAvailableTimes &&
      availableTimes?.weekAvailability?.length > 0
    ) {
      setWeekData(getWeekDaysWithNamesAndWeekNumber(today));
    }
  }, [blockedDays, availableTimes, isLoadingBloacked, isLoadingAvailableTimes]);

  const getDayOfInWeeks = (typeDay: boolean) => {
    const todayIn = dayjs(today);

    // Próximo dia da próxima semana
    let weekSameDay;
    if (typeDay) {
      weekSameDay = todayIn.add(7, "day");
    } else {
      weekSameDay = todayIn.subtract(7, "day");
    }
    setToday(weekSameDay.format("YYYY-MM-DD"));
  };
  const getInfoCalendar = async () => {
    try {
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
    if (value === "one") {
      getInfoCalendar();
      getDaysName(today);
    }
  }, [today]);

  const daysOfWeeksIsArray = weekData.daysOfWeek?.length;

  return (
    <>
      <div className={`p-6 overflow-x-scroll `}>
        <div>
          <HeaderCalendarWeek
            data={dateWeeks}
            isLoading={isLoadingAll}
            daysOfWeeksIsArray={daysOfWeeksIsArray}
            getDayOfInWeeks={getDayOfInWeeks}
          />

          {isLoadingAll ? (
            <Skeleton
              className="border border-gray-600 rounded-b-md"
              variant="rectangular"
              height={350}
            />
          ) : (
            <div
              style={{
                gridTemplateColumns: "repeat(8, 1fr)",
                overflow: "auto",
              }}
              className="grid bg-[#202024] capitalize border border-gray-600 overflow-x-auto relative "
            >
              {/* Coluna de Horas */}
              <Box
                sx={{
                  paddingTop: {
                    xs: "59px",
                    md: 8,
                    xl: 8,
                  },
                }}
                minWidth={{
                  md: 100,
                  xl: 100,
                  xs: 54,
                }}
                bgcolor={"Highlight"}
                className="flex flex-col border-gray-600 sticky left-0 z-10 pt-6"
              >
                <div className="flex items-center justify-center  border-b  bg-[#202024]  border-gray-600"></div>
                {weekData.hoursdays?.map((hour, index) => (
                  <Box
                    key={hour}
                    height={65}
                    className={`flex items-center bg-[#00291D] justify-center  border-gray-600 ${
                      index + 1 === weekData.hoursdays.length ? "" : "border-b"
                    }`}
                  >
                    {`${String(hour).padStart(2, "0")}:00`}
                  </Box>
                ))}
              </Box>
              {/* Colunas dos Dias */}
              {weekData.daysOfWeek?.map((day) => (
                <Box
                  key={day.date}
                  borderColor={"#4b5563"}
                  borderRight={"1px solid #4b5563"}
                  bgcolor={`${!day.blocked && "#323238"}`}
                >
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    py={1}
                    borderBottom={1}
                    borderColor={"#4b5563"}
                  >
                    <strong>{day.dayName}</strong>
                    <p>{dayjs(day.date).format("DD/MM")}</p>
                  </Box>
                  {weekData.hoursdays.map((hour) => (
                    <Box
                      key={`${day.date}-${hour}`}
                      height={65}
                      minWidth={150}
                      px={1}
                      className={`flex items-center justify-center h-16 border-b border-gray-600 ${
                        !day.hoursDay.some((hourDay) => hour === hourDay) &&
                        "bg-[#202024]"
                      }`}
                    >
                      {/* Verifica se há um agendamento para esse horário */}
                      {day.appointments?.find(
                        (appt) => +appt.hours === hour
                      ) ? (
                        <Scheduling
                          data={
                            day.appointments?.find(
                              (appt) => +appt.hours === hour
                            )!
                          }
                        />
                      ) : null}
                    </Box>
                  ))}
                </Box>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
