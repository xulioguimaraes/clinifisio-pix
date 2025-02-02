export interface ITransaction {
  id?: string;
  title: string;
  price: number;
  description: string;
  type: boolean;
  createdAt: string;
}
export interface ITable {
  handleTransaction: (e: ITransaction) => void;
  onOpenNewTransactionModal?: () => void;
}
export interface IValuesTransactionModal {
  id?: Number;
  title: string;
  price: string;
  description: string;
  type: boolean;
}

export interface IServices {
  id?: string;
  name: string;
  description: any;
  price: number;
  porcentagem?: any;
}

export interface IAppointments {
  name: string;
  email: string;
  observations: string;
  phone: string;
  date: number;
  hours: number;
  service: {
    name: string;
    price: string;
    description: string;
  };
}
export interface IWeekData {
  weekNumber: number;
  daysOfWeek: {
    date: string;
    dayName: string;
    blocked: boolean;
    hoursDay: number[];
    appointments: IAppointments[];
  }[];
  hoursdays: number[]; // Certifique-se que o nome da propriedade esteja correto
  monthName: string;
}
export interface IAvailableTimes {
  weekAvailability: {
    availableTimes: number[];
    scheduledServices: IAppointments[];
  }[];
  uniqueAvailableTimes: number[];
}
