import { withAuth } from "@/hoc/withAuth";
import dayjs from "dayjs";
import "dayjs/locale/pt-br"; // Importar o idioma Português do Brasil
import isoWeek from "dayjs/plugin/isoWeek";

import { ScheduledTimesPage } from "@/views/scheduledTimes";
dayjs.extend(isoWeek);
dayjs.locale("pt-br");

function IntervalsTime() {
  return <ScheduledTimesPage />;
}

export default withAuth(IntervalsTime);
