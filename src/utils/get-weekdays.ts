import dayjs from "dayjs";

interface GetWeekDaysParams {
  short?: boolean;
}
export const getWeekDays = ({ short = false }: GetWeekDaysParams = {}) => {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
  });
  const year = dayjs().get("year");
  return Array.from(Array(7).keys())
    .map((day) => formatter.format(new Date(Date.UTC(year, 5, day))))
    .map((weekday) => {
      if (short) {
        return weekday.substring(0, 3).toUpperCase();
      }
      return weekday.substring(0, 1).toUpperCase().concat(weekday.substring(1));
    });
};
