import { getWeekDays } from "@/utils/get-weekdays";
import dayjs from "dayjs";
import { ArrowLeft, ArrowRight } from "phosphor-react";
import { useState } from "react";
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  Calendarday,
  CalendarHeader,
  CalendarTiles,
} from "./styles";

export const Calendar = () => {
  const shortWeekDays = getWeekDays({
    short: true,
  });

  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set("date", 1);
  });

  const currentMonth = currentDate.format("MMMM");
  const currentYear = currentDate.format("YYYY");

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
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <Calendarday disabled>1</Calendarday>
            </td>
            <td>
              <Calendarday>2</Calendarday>
            </td>
            <td>
              <Calendarday>3</Calendarday>
            </td>
          </tr>
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  );
};
