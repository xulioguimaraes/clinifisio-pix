import { users } from "@/services/users";
import { IAvailableTimes, IWeekData } from "@/types";
import {
  Box,
  Skeleton,
  Popover,
  IconButton,
  Dialog,
  Modal,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import isBetweenPlugin from "dayjs/plugin/isBetween";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/pt-br";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Scheduling } from "./Scheduling";

import { useScheduling } from "../hooks/useScheduling";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { ConfrimStep } from "./ConfirmStep";

dayjs.extend(isBetweenPlugin);
dayjs.extend(updateLocale);
dayjs.locale("pt-br");

interface CustomPickerDayProps extends PickersDayProps {
  isSelected: boolean;
  isHovered: boolean;
}

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== "isSelected" && prop !== "isHovered",
})<CustomPickerDayProps>(({ theme, isSelected, isHovered, day }) => ({
  borderRadius: 0,
  ...(isSelected && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.main,
    },
  }),
  ...(isHovered && {
    backgroundColor: theme.palette.primary.light,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.light,
    },
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.primary.dark,
      "&:hover, &:focus": {
        backgroundColor: theme.palette.primary.dark,
      },
    }),
  }),
  ...(day.day() === 0 && {
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "50%",
  }),
  ...(day.day() === 6 && {
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
  }),
})) as React.ComponentType<CustomPickerDayProps>;

const isInSameWeek = (dayA: Dayjs, dayB: Dayjs | null | undefined) => {
  if (dayB == null) {
    return false;
  }
  return dayA.isSame(dayB, "week");
};

function Day(
  props: PickersDayProps & {
    selectedDay?: Dayjs | null;
    hoveredDay?: Dayjs | null;
  }
) {
  const { day, selectedDay, hoveredDay, ...other } = props;

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={{ px: 2.5 }}
      disableMargin
      selected={false}
      isSelected={isInSameWeek(day, selectedDay)}
      isHovered={isInSameWeek(day, hoveredDay)}
    />
  );
}

export const TabWeeks = ({ value }: { value: "one" }) => {
  const { data: session } = useSession();
  const { setToday, today } = useScheduling();
  const [hoveredDay, setHoveredDay] = useState<Dayjs | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs(today));
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [showModalRegister, setShowModalRegister] = useState(false);
  const [dataRegister, setDataRegister] = useState<any>(null);

  const onChangeShowModalRegister = () => {
    setShowModalRegister(!showModalRegister);
  };

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
    const newDate = dayjs(today)
      .add(typeDay ? 7 : -7, "day")
      .format("YYYY-MM-DD");
    setToday(newDate);
    setSelectedDate(dayjs(newDate));
  };
  const { data: services = [] } = useQuery({
    queryKey: ["services", username],
    queryFn: async () => {
      const { data } = await users.getServicesUser(username!);
      return data;
    },
    enabled: !!username,
  });

  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setSelectedDate(newValue);
      setToday(newValue.format("YYYY-MM-DD"));
      setAnchorEl(null);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div className={`p-6 overflow-x-scroll`}>
      <Modal open={showModalRegister} onClose={onChangeShowModalRegister}>
        <ConfrimStep
          schedulingDate={dataRegister}
          onCancelConfitmation={onChangeShowModalRegister}
          service={services}
        />
      </Modal>

      <Box
        mb={{
          mb: 0,
          xl: 0,
          xs: 10,
        }}
      >
        <Box>
          <Box display={"flex"} justifyContent={"center"} onClick={handleClick}>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              bgcolor={"#90caf9"}
              borderRadius={999}
              width={"fit-content"}
              px={0.5}
              my={1}
            >
              {weekData.daysOfWeek?.length > 0 && (
                <>
                  {dateWeeks.map((date) => (
                    <Box
                      component={"span"}
                      fontSize={"0.75rem"}
                      color={"black"}
                      width="36px"
                      height={"36px"}
                      textAlign={"center"}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      key={date.date}
                    >
                      {dayjs(date.date).format("D")}
                    </Box>
                  ))}
                </>
              )}
            </Box>
          </Box>
        </Box>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Box sx={{ bgcolor: "#202024" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                showDaysOutsideCurrentMonth
                slots={{ day: Day }}
                slotProps={{
                  day: (ownerState) =>
                    ({
                      selectedDay: selectedDate,
                      hoveredDay,
                      onPointerEnter: () => setHoveredDay(ownerState.day),
                      onPointerLeave: () => setHoveredDay(null),
                    } as any),
                }}
              />
            </LocalizationProvider>
          </Box>
        </Popover>

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
            className="grid bg-[#202024] capitalize border border-gray-600 overflow-x-auto relative"
          >
            {/* Coluna de Horas */}
            <Box
              sx={{ paddingTop: { xs: "59px", md: 8, xl: 8 } }}
              minWidth={{ md: 80, xl: 80, xs: 54 }}
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
                    onClick={() => {
                      if (!!day.hoursDay.includes(hour)) {
                        setDataRegister({
                          date: day.date,
                          hour,
                        });
                        setShowModalRegister(true);
                      }
                    }}
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
