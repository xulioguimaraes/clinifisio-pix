import { withAuth } from "@/hoc/withAuth";
import dayjs from "dayjs";
import "dayjs/locale/pt-br"; // Importar o idioma Português do Brasil

dayjs.locale("pt-br");

function IntervalsTime() {
  return <>Perfil</>;
}

export default withAuth(IntervalsTime);
