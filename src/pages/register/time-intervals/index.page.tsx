import { converTimeStringToMinutes } from "@/utils/conver-time-string-to-minutes";
import { getWeekDays } from "@/utils/get-weekdays";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from "@ignite-ui/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { ArrowRight } from "phosphor-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Container, Header } from "../styles";
import {
  FormError,
  IntervalBox,
  IntervalContainer,
  IntervalDay,
  IntervalInput,
  IntervalItem,
} from "./styles";
import { api } from "@/services/api";

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

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>;
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>;

export default function TimeIntervals() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        {
          weekDay: 0,
          enabled: false,
          startTime: "08:00",
          endTime: "08:00",
        },
        {
          weekDay: 1,
          enabled: true,
          startTime: "08:00",
          endTime: "08:00",
        },
        {
          weekDay: 2,
          enabled: true,
          startTime: "08:00",
          endTime: "08:00",
        },
        {
          weekDay: 3,
          enabled: true,
          startTime: "08:00",
          endTime: "08:00",
        },
        {
          weekDay: 4,
          enabled: true,
          startTime: "08:00",
          endTime: "08:00",
        },
        {
          weekDay: 5,
          enabled: true,
          startTime: "08:00",
          endTime: "08:00",
        },
        {
          weekDay: 6,
          enabled: false,
          startTime: "08:00",
          endTime: "08:00",
        },
      ],
    },
  });
  const { fields } = useFieldArray({
    control,
    name: "intervals",
  });

  const weekDays = getWeekDays();

  const intervals = watch("intervals");

  const router = useRouter();
  const handleSetTimeIntervals = async (data: any) => {
    const { intervals } = data as TimeIntervalsFormOutput;
    await api.post("/users/time-intervals", { intervals });
    await router.push("/register/update-profile");
  };
  return (
    <>
      <NextSeo title="Selecione sua disponibilidade | Call" noindex />

      <Container>
        <Header>
          <Heading as="strong">Quase lá</Heading>
          <Text>
            Defina o intervalo de horaios que você esta disponivel em cada dia
            da semana.
          </Text>

          <MultiStep size={4} currentStep={3} />

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
            <Button type="submit" disabled={isSubmitting}>
              Proximo passo <ArrowRight />
            </Button>
          </IntervalBox>
        </Header>
      </Container>
    </>
  );
}
