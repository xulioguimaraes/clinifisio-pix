import dayjs from "dayjs";

interface GetWeekDaysParams {
  short?: boolean;
}
export const getWeekDays = ({ short = false }: GetWeekDaysParams = {}) => {
  const week = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];
  return short ? week.map((item) => item.substring(0, 3).toUpperCase()) : week;
};
