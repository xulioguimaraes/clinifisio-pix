export const converTimeStringToMinutes = (timeString: string) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

export const convertMinutesToTimeString = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60); // Divide os minutos totais por 60 para obter as horas
  const minutes = totalMinutes % 60; // Usa o módulo para obter os minutos restantes
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

export const converNumberForMoney = (value: number) => {
  if (!value) {
    return "R$ 0";
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
};

export const convertDateInFormatLongPtBr = (value: string) => {
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });
};
