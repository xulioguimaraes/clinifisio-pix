import { users } from "@/services/users";
import { IAvailableTimes, IWeekData } from "@/types";
import { Box, Skeleton } from "@mui/material";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Scheduling } from "./Scheduling";
import { HeaderCalendarWeek } from "./HeaderCalendarWeek";
import { useScheduling } from "../hooks/useScheduling";

export const TabWeeks = ({ value }: { value: "one" }) => {
  const { data: session } = useSession();
  const { setToday, today } = useScheduling();

  const username = session?.user?.username;

  // Fetch Blocked Days
  const { data: blockedDays = [], isLoading: isLoadingBlockedDays } = useQuery({
    queryKey: ["blockedDays", username, today],
    queryFn: async () => {
      if (!username || !today) return [];
      const { data } = await users.getBlockedDays(username, {
        year: dayjs(today).year(),
        month: dayjs(today).month(),
      });
      return data?.blockedWeekDays || [];
    },
    enabled: !!username && !!today,
  });

  // Fetch Available Times
  const {
    data: availableTimes = {} as IAvailableTimes,
    isLoading: isLoadingAvailableTimes,
  } = useQuery({
    queryKey: ["availableTimes", username, today],
    queryFn: async () => {
      if (!username || !today) return {} as IAvailableTimes;
      const { data } = await users.getAvailableTimes(username, {
        startOfWeek: today,
      });
      return data || {};
    },
    enabled: !!username && !!today,
  });

  const [dateWeeks, setDateWeeks] = useState<
    { date: string; monthName: string; weekNumber: number }[]
  >([]);

  const isLoadingAll = isLoadingBlockedDays || isLoadingAvailableTimes;

  const getDaysName = (dateReference?: string) => {
    if (!dateReference) return;
    const startOfWeek = dayjs(dateReference).startOf("week");
    setDateWeeks(
      Array.from({ length: 7 }).map((_, index) => ({
        date: startOfWeek.add(index, "day").format("YYYY-MM-DD"),
        monthName: dayjs(dateReference).format("MMMM"),
        weekNumber: dayjs(dateReference).isoWeek(),
      }))
    );
  };

  useEffect(() => {
    if (value === "one" && today) {
      getDaysName(today);
    }
  }, [today]);

  const weekData: IWeekData = {
    weekNumber: today ? dayjs(today).isoWeek() : 0,
    monthName: today ? dayjs(today).format("MMMM") : "",
    daysOfWeek: today
      ? Array.from({ length: 7 }).map((_, index) => {
          const date = dayjs(today)
            .startOf("week")
            .add(index, "day")
            .format("YYYY-MM-DD");
          return {
            date,
            dayName: dayjs(date).format("ddd"),
            blocked: blockedDays.includes(index),
            hoursDay:
              availableTimes?.weekAvailability?.[index]?.availableTimes || [],
            appointments:
              availableTimes?.weekAvailability?.[index]?.scheduledServices ||
              [],
          };
        })
      : [],
    hoursdays: availableTimes?.uniqueAvailableTimes || [],
  };

  const getDayOfInWeeks = (typeDay: boolean) => {
    if (!today) return;
    setToday(
      dayjs(today)
        .add(typeDay ? 7 : -7, "day")
        .format("YYYY-MM-DD")
    );
  };

  return (
    <div className={`p-6 overflow-x-scroll `}>
      <Box
        mb={{
          mb: 0,
          xl: 0,
          xs: 10,
        }}
      >
        <HeaderCalendarWeek
          data={dateWeeks}
          isLoading={isLoadingAll}
          daysOfWeeksIsArray={weekData.daysOfWeek?.length}
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
              sx={{ paddingTop: { xs: "59px", md: 8, xl: 8 } }}
              minWidth={{ md: 100, xl: 100, xs: 54 }}
              bgcolor={"Highlight"}
              className="flex flex-col border-gray-600 sticky left-0 z-10 pt-6"
            >
              <div className="flex items-center justify-center border-b bg-[#202024] border-gray-600"></div>
              {weekData.hoursdays?.map((hour, index) => (
                <Box
                  key={hour}
                  height={65}
                  className={`flex items-center bg-[#00291D] justify-center border-gray-600 ${
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
                      !day.hoursDay.includes(hour) && "bg-[#202024]"
                    }`}
                  >
                    {day.appointments?.find((appt) => +appt.hours === hour) ? (
                      <Scheduling
                        data={
                          day.appointments.find((appt) => +appt.hours === hour)!
                        }
                      />
                    ) : null}
                  </Box>
                ))}
              </Box>
            ))}
          </div>
        )}
      </Box>
    </div>
  );
};
