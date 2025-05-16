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
  active?: boolean;
  images?: string[];
}

export interface IAppointments {
  status: number;
  name: string;
  id?: id;
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

type Scheduling = {
  id: string;
  name: string;
  email: string;
  phone: string;
  observations: string;
  date: string;
  status: 1 | 2 | 3 | 4;
  service: {
    id: string;
    name: string;
    description: string;
    price: number;
    porcentagem: number;
  };
};
