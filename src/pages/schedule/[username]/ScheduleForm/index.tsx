import { useState } from "react";
import { CalendarStep } from "./CalendarStep";
import { ConfrimStep } from "./ConfirmStep";

export const ScheduleForm = () => {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>();

  const handleClearSelectedDateTime = () => {
    setSelectedDateTime(null);
  };
  if (selectedDateTime) {
    return <ConfrimStep schedulingDate={selectedDateTime} onCancelConfitmation={handleClearSelectedDateTime} />;
  }
  return <CalendarStep onSelectDateTime={setSelectedDateTime} />;
};
