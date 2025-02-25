import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { TabWeeks } from "./components/TabWeeks";
import { ListSchedulings } from "./components/ListSchedulings";
import { SchedulingProvider } from "./hooks/useScheduling";

export const ScheduledTimesPage = () => {
  const [value, setValue] = useState("one");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <SchedulingProvider>
      <div style={{ width: "100%" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="wrapped label tabs example"
        >
          <Tab value="one" label="Semana" wrapped />
          <Tab value="two" label="Lista" />
        </Tabs>

        {value === "one" && <TabWeeks value={value} />}
        {value === "two" && <ListSchedulings value={value} />}
      </div>
    </SchedulingProvider>
  );
};
