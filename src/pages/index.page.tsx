import { withAuth } from "@/hoc/withAuth";
import { Home } from "@/views/home";

function Login() {
  return <Home />;
}
export default withAuth(Login);
