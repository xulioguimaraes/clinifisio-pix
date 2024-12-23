import { Calendar } from "@/components/Calendar";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from "./styles";
interface Availability {
  possibleTimes: number[];
  availableTimes: number[];
}
interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void;
}

export const CalendarStep = ({ onSelectDateTime }: CalendarStepProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const isDateSelected = !!selectedDate;
  const router = useRouter();
  const username = String(router.query.username);
  const weekDay = selectedDate ? dayjs(selectedDate).format("dddd") : null;
  const describedDate = selectedDate
    ? dayjs(selectedDate).format("DD[ de ]MMMM")
    : null;

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format("YYYY-MM-DD")
    : null;
  const { data: availability } = useQuery<Availability>(
    ["availability", selectedDateWithoutTime],
    async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
        },
      });
      return response.data;
    },
    {
      enabled: !!selectedDate,
    }
  );
  const handleSelectTime = (hour: number) => {
    const dateWithTime = dayjs(selectedDate)
      .set("hour", hour)
      .startOf("hour")
      .toDate();

    onSelectDateTime(dateWithTime);
  };

  const unavailableTimes = availability?.availableTimes.map((availableTime) => {
    return dayjs(availableTime).get("hour");
  });
  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{describedDate}</span>
          </TimePickerHeader>
          <TimePickerList>
            {availability?.possibleTimes?.map((hour) => (
              <TimePickerItem
                onClick={() => handleSelectTime(hour)}
                // disabled={!availability.availableTimes.includes(hour)}
                disabled={
                  unavailableTimes?.includes(hour) ||
                  dayjs(selectedDate).set("hour", hour).isBefore(new Date())
                }
                key={hour}
              >
                {String(hour).padStart(2, "0")}:00h
              </TimePickerItem>
            ))}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  );
};
