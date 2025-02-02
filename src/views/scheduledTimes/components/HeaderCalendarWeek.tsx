import { IAppointments } from "@/types";
import dayjs from "dayjs";
import { ArrowLeft, ArrowRight } from "phosphor-react";

export const HeaderCalendarWeek = ({
  data,
  daysOfWeeksIsArray,
  isLoading,
  getDayOfInWeeks,
}: {
  data: { date: string; monthName: string; weekNumber: number }[];
  daysOfWeeksIsArray: number;
  isLoading: boolean;
  getDayOfInWeeks: (type: boolean) => void;
}) => {
  return (
    <div className="p-4 uppercase border border-gray-600 rounded-t-md bg-[#202024] flex justify-between">
      <div>
        <h3>{data[0]?.monthName}</h3>
        <p>Semana: {data[0]?.weekNumber}</p>
      </div>
      <div>
        <div>
          {daysOfWeeksIsArray > 0 && (
            <>
              <span>{dayjs(data[0].date).format("DD/MM")}</span> -{" "}
              <span>{dayjs(data[data.length - 1].date).format("DD/MM")}</span>
            </>
          )}
        </div>
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => getDayOfInWeeks(false)}
            className="border border-gray-600 rounded-md"
          >
            <ArrowLeft size={22} />
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => getDayOfInWeeks(true)}
            className="border border-gray-600 rounded-md"
          >
            <ArrowRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};
