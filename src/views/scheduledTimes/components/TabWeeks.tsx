import { useToastContext } from "@/hooks/useToast";
import { users } from "@/services/users";
import { IAvailableTimes, IWeekData } from "@/types";
import { Skeleton } from "@mui/material";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { ArrowLeft, ArrowRight } from "phosphor-react";
import { useEffect, useState } from "react";

export const TabWeeks = ({ isOpen = false }) => {
  const toast = useToastContext();
  const { data: session } = useSession();
  const [isLoadingBloacked, setIsLoadingBloacked] = useState(true);
  const [isLoadingAvailableTimes, setIsLoadingAvailableTimes] = useState(true);
  const [today, setToday] = useState(dayjs().format("YYYY-MM-DD"));
  const [blockedDays, setBlockedDays] = useState<number[]>([]);
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

  const [weekData, setWeekData] = useState<IWeekData>({} as IWeekData);

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
    getInfoCalendar();
    getDaysName(today);
  }, [today]);

  const daysOfWeeksIsArray = weekData.daysOfWeek?.length;

  return (
    <>
      <div className={`p-6 overflow-x-scroll ${isOpen ? "block" : "hidden"}`}>
        <div>
          <div className="p-4 uppercase border border-gray-600 rounded-t-md bg-[#202024] flex justify-between">
            <div>
              <h3>{dateWeeks[0]?.monthName}</h3>
              <p>Semana: {dateWeeks[0]?.weekNumber}</p>
            </div>
            <div>
              <div>
                {daysOfWeeksIsArray > 0 && (
                  <>
                    <span>{dayjs(dateWeeks[0].date).format("DD/MM")}</span> -{" "}
                    <span>
                      {dayjs(dateWeeks[dateWeeks.length - 1].date).format(
                        "DD/MM"
                      )}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={isLoadingAll}
                  onClick={() => getDayOfInWeeks(false)}
                  className="border border-gray-600 rounded-md"
                >
                  <ArrowLeft size={22} />
                </button>
                <button
                  type="button"
                  disabled={isLoadingAll}
                  onClick={() => getDayOfInWeeks(true)}
                  className="border border-gray-600 rounded-md"
                >
                  <ArrowRight size={22} />
                </button>
              </div>
            </div>
          </div>
          {false ? (
            <Skeleton
              className="border border-gray-600 rounded-b-md"
              variant="rectangular"
              height={350}
            />
          ) : (
            <div className="grid bg-[#202024]  grid-flow-col auto-cols-[150px] capitalize border border-gray-600 overflow-x-auto relative ">
              {/* Coluna de Horas */}
              <div className="flex flex-col border-r border-t border-gray-600 sticky left-0 z-10">
                <div className="flex items-center justify-center h-16 border-b bg-[#202024]  border-gray-600"></div>
                {weekData.hoursdays?.map((hour, index) => (
                  <div
                    key={hour}
                    className={`flex items-center bg-[#00291D] justify-center h-16  border-gray-600 ${
                      index + 1 === weekData.hoursdays.length ? "" : "border-b"
                    }`}
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
                      className={`flex items-center justify-center h-16 border-b border-gray-600 ${
                        !day.hoursDay.some((hourDay) => hour === hourDay) &&
                        "bg-[#202024]"
                      }`}
                    >
                      {/* Verifica se há um agendamento para esse horário */}
                      {day.appointments?.find(
                        (appt) => +appt.hours === hour
                      ) ? (
                        <div className="h-full w-full bg-blue-200 text-black px-1 mx-1 py-1  rounded-md text-sm">
                          <p>
                            {
                              day.appointments.find(
                                (appt) => +appt.hours === hour
                              )?.service?.name
                            }
                          </p>
                          <p className="text-xs text-gray-50000">
                            {
                              day.appointments.find(
                                (appt) => +appt.hours === hour
                              )?.name
                            }
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
