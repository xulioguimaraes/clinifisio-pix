import { withAuth } from "@/hoc/withAuth";
import { Transactions } from "@/views/Transactions";

function Painel() {
  return <Transactions />;
}
export default withAuth(Painel);
