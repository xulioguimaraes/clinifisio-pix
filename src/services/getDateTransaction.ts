import { api } from "./api";

export default async function getdatetransaction() {
  const response = await api
    .get("getdatetransaction")
    .then((item) => item.data)
    .catch(() => false);
  return response;
}
