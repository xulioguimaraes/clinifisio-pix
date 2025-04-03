import { Calendar } from "@/components/Calendar";
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
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { api } from "@/services/api";
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
  const { data: availability, isLoading } = useQuery<Availability>(
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
        <Stack
          border={"1px solid $gray600"}
          px={2}
          pt={2}
          borderRadius={2}
          overflow={{
            xs: "hidden",
            xl: "scroll",
            md: "scroll",
          }}
          position={{
            md: "absolute",
            xl: "absolute",
            xs: "relative",
          }}
          top={0}
          bottom={0}
          right={0}
          bgcolor={"#202024"}
          maxWidth={{
            md: 280,
            xs: "auto",
            xl: 280,
          }}
          width={"100%"}
        >
          <TimePickerHeader className="flex justify-between items-center">
            <p>
              {weekDay} <span>{describedDate}</span>
            </p>

            <button
              type="button"
              className="md:hidden"
              onClick={() => setSelectedDate(null)}
            >
              <Close fontSize="medium" />
            </button>
          </TimePickerHeader>
          <TimePickerList>
            {isLoading ? (
              <Box
                width={"100%"}
                height={196}
                display={"flex"}
                justifyContent={"center"}
                flexDirection={"column"}
                gap={2}
                alignItems={"center"}
                overflow={"hidden"}
              >
                <CircularProgress />
                <Typography>Carregando...</Typography>
              </Box>
            ) : (
              <>
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
              </>
            )}
          </TimePickerList>
        </Stack>
      )}
    </Container>
  );
};
