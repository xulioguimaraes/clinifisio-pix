import { getWeekDays } from "@/utils/get-weekdays";
import dayjs from "dayjs";
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
interface CalendarWeek {
  week: number;
  days: Array<{
    date: dayjs.Dayjs;
    disabled: boolean;
  }>;
}

type CalendarWeeks = CalendarWeek[];

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelected: (date: Date) => void;
}
export const Calendar = ({ onDateSelected, selectedDate }: CalendarProps) => {
  const shortWeekDays = getWeekDays({
    short: true,
  });

  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set("date", 1);
  });

  const currentMonth = currentDate.format("MMMM");
  const currentYear = currentDate.format("YYYY");
  const calendarWeeks = useMemo(() => {
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
        disabled: date.endOf("day").isBefore(new Date()),
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
  }, [currentDate]);

  const handlePreviousMonth = () => {
    const previousMonthDate = currentDate.subtract(1, "month");

    setCurrentDate(previousMonthDate);
  };
  const handleNextMonth = () => {
    const nextMonthDate = currentDate.add(1, "month");

    setCurrentDate(nextMonthDate);
  };
  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTiles>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTiles>
        <CalendarActions>
          <button onClick={handlePreviousMonth} title="Previous mouth">
            <ArrowLeft />
          </button>
          <button onClick={handleNextMonth} title="Next mouth">
            <ArrowRight />
          </button>
        </CalendarActions>
      </CalendarHeader>
      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekDay) => (
              <th key={weekDay}>{weekDay}.</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ days, week }) => {
            return (
              <tr key={week}>
                {days.map(({ date, disabled }) => (
                  <td key={date.toString()}>
                    <Calendarday
                      onClick={() => onDateSelected(date.toDate())}
                      disabled={disabled}
                    >
                      {date.get("date")}
                    </Calendarday>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  );
};
