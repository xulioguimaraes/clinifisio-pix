import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { ArrowLeft, ArrowRight } from "phosphor-react";
import { useMemo, useState } from "react";
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  Calendarday,
  CalendarHeader,
  CalendarTiles,
} from "./styles";
import { api } from "@/services/api";
import {
  Box,
  CircularProgress,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
interface CalendarWeek {
  week: number;
  days: Array<{
    date: dayjs.Dayjs;
    disabled: boolean;
  }>;
}

const HEIGHT_MOBILE_CALENDAR = 215;
const HEIGHT_DESKTOP_CALENDAR = 380;

const HEIGHT_SHADOW_MOBILE_CALENDAR = 195;
const HEIGHT_SHADOW_DESKTOP_CALENDAR = 360;
import styles from "@/styles/global.module.scss";

interface BlockedDates {
  blockedWeekDays: number[];
  blockedDates: number[];
}

type CalendarWeeks = CalendarWeek[];

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelected: (date: Date) => void;
}
export const Calendar = ({ onDateSelected, selectedDate }: CalendarProps) => {
  const startOfWeek = dayjs(new Date()).startOf("week");
  const shortWeekDays = Array.from({ length: 7 }).map((item, index) =>
    startOfWeek.add(index, "day").format("ddd")
  );
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set("date", 1);
  });
  const username = String(router.query.username);

  const year = currentDate.get("year");
  const month = currentDate.get("month");

  const { data: blockedDates, isLoading } = useQuery<BlockedDates>(
    ["blocked-dates", year, month],
    async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year,
          month: String(month + 1).padStart(2, "0"),
        },
      });
      return response.data;
    }
  );

  const currentMonth = currentDate.format("MMMM");
  const currentYear = currentDate.format("YYYY");
  const calendarWeeks = useMemo(() => {
    if (!blockedDates) {
      return [];
    }
    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => currentDate.set("date", i + 1));

    const fristWeekDay = currentDate.get("day");

    const previousMonthFillArray = Array.from({
      length: fristWeekDay,
    })
      .map((_, i) => currentDate.subtract(i + 1, "day"))
      .reverse();
    const lastDayInCurrentMonth = currentDate.set(
      "date",
      currentDate.daysInMonth()
    );

    const lastWeekDay = lastDayInCurrentMonth.get("day");

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => lastDayInCurrentMonth.add(i + 1, "day"));

    const calendarDays = [
      ...previousMonthFillArray.map((date) => ({ date, disabled: true })),
      ...daysInMonthArray.map((date) => ({
        date,
        disabled:
          date.endOf("day").isBefore(new Date()) ||
          blockedDates.blockedWeekDays.includes(date.get("day")) ||
          blockedDates.blockedDates.includes(date.get("date")),
      })),
      ...nextMonthFillArray.map((date) => ({ date, disabled: true })),
    ];

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0;

        if (isNewWeek) {
          weeks.push({
            week: 1 / 7 + 1,
            days: original.slice(i, i + 7),
          });
        }
        return weeks;
      },
      []
    );
    return calendarWeeks;
  }, [currentDate, blockedDates]);

  const handlePreviousMonth = () => {
    const previousMonthDate = currentDate.subtract(1, "month");

    setCurrentDate(previousMonthDate);
  };
  const handleNextMonth = () => {
    const nextMonthDate = currentDate.add(1, "month");

    setCurrentDate(nextMonthDate);
  };
  return (
    <CalendarContainer
      style={{
        display: selectedDate && isXs ? "none" : "flex",
      }}
    >
      <CalendarHeader>
        <CalendarTiles>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTiles>
        <CalendarActions>
          <button
            disabled={isLoading}
            onClick={handlePreviousMonth}
            title="Previous mouth"
          >
            <ArrowLeft />
          </button>
          <button
            disabled={isLoading}
            onClick={handleNextMonth}
            title="Next mouth"
          >
            <ArrowRight />
          </button>
        </CalendarActions>
      </CalendarHeader>
      <CalendarBody
        style={{
          minHeight: isXs ? HEIGHT_MOBILE_CALENDAR : HEIGHT_DESKTOP_CALENDAR,
        }}
      >
        <>
          <thead>
            <tr>
              {shortWeekDays.map((weekDay) => (
                <th className="uppercase" key={weekDay}>
                  {weekDay}.
                </th>
              ))}
            </tr>
          </thead>
          <Box component={"tbody"} position={"relative"}>
            <>
              {isLoading && (
                <Box
                  width={"100%"}
                  height={"100%"}
                  minHeight={
                    isXs
                      ? HEIGHT_SHADOW_MOBILE_CALENDAR
                      : HEIGHT_SHADOW_DESKTOP_CALENDAR
                  }
                  display={"flex"}
                  position={"absolute"}
                  justifyContent={"center"}
                  flexDirection={"column"}
                  gap={2}
                  alignItems={"center"}
                  borderRadius={2}
                  overflow={"hidden"}
                >
                  <div className={styles.desfocado}></div>
                  <CircularProgress
                    sx={{
                      zIndex: 20,
                    }}
                  />
                  <Typography
                    sx={{
                      zIndex: 20,
                    }}
                  >
                    Carregando...
                  </Typography>
                </Box>
              )}
              {calendarWeeks.map(({ days, week }) => {
                return (
                  <tr key={week}>
                    {days.map(({ date, disabled }) => {
                      const isOutsideCurrentMonth =
                        date.month() !== currentDate.month();

                      return (
                        <td
                          style={{
                            padding: "2px",
                            opacity: isOutsideCurrentMonth ? 0.3 : 1,
                            pointerEvents: isOutsideCurrentMonth
                              ? "none"
                              : "auto",
                          }}
                          key={date.toString()}
                        >
                          {isOutsideCurrentMonth ? (
                            <></>
                          ) : (
                            <Calendarday
                              onClick={() => onDateSelected(date.toDate())}
                              disabled={disabled}
                            >
                              {date.get("date")}
                            </Calendarday>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </>
          </Box>
        </>
      </CalendarBody>
    </CalendarContainer>
  );
};
