import { getWeekDays } from "@/utils/get-weekdays";
import { ArrowLeft, ArrowRight } from "phosphor-react";
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
  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTiles>
          Janeiro <span>2023</span>
        </CalendarTiles>
        <CalendarActions>
          <button>
            <ArrowLeft />
          </button>
          <button>
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
              <Calendarday>1</Calendarday>
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
