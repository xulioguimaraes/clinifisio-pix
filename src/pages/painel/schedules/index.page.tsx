import { api } from "@/lib/axios";
import {
  converTimeStringToMinutes,
  convertMinutesToTimeString,
} from "@/utils/conver-time-string-to-minutes";
import { getWeekDays } from "@/utils/get-weekdays";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox, Text, TextInput } from "@ignite-ui/react";
import { NextSeo } from "next-seo";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Container, Header } from "./styles";
import {
  FormError,
  IntervalBox,
  IntervalContainer,
  IntervalDay,
  IntervalInput,
  IntervalItem,
} from "./styles";
import { Button, CircularProgress } from "@mui/material";
import { withAuth } from "@/hoc/withAuth";
import { users } from "@/services/users";
import { useEffect, useState } from "react";
import { useToastContext } from "@/hooks/useToast";

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: "Você precisa selecionar pelo menos um dia da semana!",
    })
    .transform((intervals) =>
      intervals.map((interval) => ({
        weekDay: interval.weekDay,
        startTimeInMinutes: converTimeStringToMinutes(interval.startTime),
        endTimeInMinutes: converTimeStringToMinutes(interval.endTime),
      }))
    )
    .refine(
      (intervals) =>
        intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes
        ),
      {
        message:
          "O Horatio de termino deve ser pelo menos 1h distante do início",
      }
    ),
});

const defaultValues = [
  {
    weekDay: 0,
    enabled: false,
    startTime: "08:00",
    endTime: "08:00",
  },
  {
    weekDay: 1,
    enabled: false,
    startTime: "08:00",
    endTime: "08:00",
  },
  {
    weekDay: 2,
    enabled: false,
    startTime: "08:00",
    endTime: "08:00",
  },
  {
    weekDay: 3,
    enabled: false,
    startTime: "08:00",
    endTime: "08:00",
  },
  {
    weekDay: 4,
    enabled: false,
    startTime: "08:00",
    endTime: "08:00",
  },
  {
    weekDay: 5,
    enabled: false,
    startTime: "08:00",
    endTime: "08:00",
  },
  {
    weekDay: 6,
    enabled: false,
    startTime: "08:00",
    endTime: "08:00",
  },
];

interface IIntervalResponse {
  week_day: number;
  time_start_in_minutes: number;
  time_end_in_minutes: number;
}

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>;
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>;

function TimeIntervals() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: defaultValues,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const { fields, update } = useFieldArray({
    control,
    name: "intervals",
  });

  const weekDays = getWeekDays();

  const toast = useToastContext();
  const intervals = watch("intervals");

  const getTimeIntervals = async () => {
    setIsLoading(true);
    const response = await users.getTimeIntervals();
    setIsLoading(false);
    const formattedIntervals = response.data.map(
      (interval: IIntervalResponse) => ({
        weekDay: interval.week_day,
        startTime: convertMinutesToTimeString(interval.time_start_in_minutes),
        endTime: convertMinutesToTimeString(interval.time_end_in_minutes),
        enabled: true,
      })
    );

    const newFormattedIntervals = defaultValues.map((item) => {
      const newInterval = formattedIntervals.find(
        (interval: { weekDay: number }) => interval.weekDay === item.weekDay
      );
      if (!!newInterval) {
        item = newInterval;
      }
      return item;
    });
    setValue("intervals", newFormattedIntervals);
  };

  useEffect(() => {
    getTimeIntervals();
  }, []);

  const handleSetTimeIntervals = async (data: any) => {
    const { intervals } = data as TimeIntervalsFormOutput;
    await api.post("/users/time-intervals", { intervals });
    toast.success("Horaios atualizados com sucesso");
  };
  return (
    <>
      <NextSeo title="Disponibilidade | Call" noindex />

      <Container>
        <Header>
          <Text>
            Defina o intervalo de horaios que você esta disponivel em cada dia
            da semana.
          </Text>

          <IntervalBox
            as="form"
            onSubmit={handleSubmit(handleSetTimeIntervals)}
          >
            <IntervalContainer>
              {fields.map((field, index) => {
                return (
                  <>
                    <IntervalItem key={field.id}>
                      <Controller
                        name={`intervals.${index}.enabled`}
                        control={control}
                        render={({ field }) => {
                          return (
                            <Checkbox
                              onCheckedChange={(checked) => {
                                field.onChange(checked === true);
                              }}
                              disabled={true}
                              checked={field.value}
                            />
                          );
                        }}
                      />
                      <IntervalDay>
                        <Text>{weekDays[field.weekDay]}</Text>
                      </IntervalDay>

                      <IntervalInput>
                        <TextInput
                          size={"sm"}
                          type="time"
                          step={60}
                          disabled={intervals[index].enabled === false}
                          {...register(`intervals.${index}.startTime`)}
                        />
                        <TextInput
                          size={"sm"}
                          type="time"
                          disabled={intervals[index].enabled === false}
                          step={60}
                          {...register(`intervals.${index}.endTime`)}
                        />
                      </IntervalInput>
                    </IntervalItem>
                  </>
                );
              })}
            </IntervalContainer>

            {errors.intervals && (
              <FormError size="sm">{errors.intervals.message}</FormError>
            )}
            <Button
              variant="contained"
              color="success"
              type="submit"
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
              }}
              disabled={isSubmitting || isLoading}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} />
                  <p className="pr-4">Buscando Informações</p>
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </IntervalBox>
        </Header>
      </Container>
    </>
  );
}

export default withAuth(TimeIntervals);
