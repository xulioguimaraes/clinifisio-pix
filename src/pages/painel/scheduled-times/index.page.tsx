import { withAuth } from "@/hoc/withAuth";
import { Box, Tab, Tabs } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import "dayjs/locale/pt-br"; // Importar o idioma Português do Brasil
import isoWeek from "dayjs/plugin/isoWeek";

import { TabWeeks } from "@/views/scheduledTimes/components/TabWeeks";
import { ListSchedulings } from "@/views/scheduledTimes/components/ListSchedulings";
dayjs.extend(isoWeek);
dayjs.locale("pt-br");

function IntervalsTime() {
  const [value, setValue] = useState("one");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div style={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="wrapped label tabs example"
      >
        <Tab value="one" label="Semana" wrapped />
        <Tab value="two" label="Lista" />
      </Tabs>

      <TabWeeks isOpen={value === "one"} />
      <ListSchedulings isOpen={value === "two"} />
    </div>
  );
}

export default withAuth(IntervalsTime);
