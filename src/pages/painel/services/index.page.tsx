import { withAuth } from "@/hoc/withAuth";
import { TableServices } from "@/views/Services/TableServices";

function Services() {
  return (
    <>
      <TableServices />
    </>
  );
}
export default withAuth(Services);
