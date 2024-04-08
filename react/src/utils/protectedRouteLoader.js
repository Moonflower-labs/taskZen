import { redirect } from "react-router-dom";
import authProvider from "./authProvider";
import fetchAPI from "../api/fetch";

export default async function protectedRouteLoader({ request }) {
  let user = (await fetchAPI("api/user/profile")) || authProvider.user;
  if (!user) {
    let params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }
  return null;
}
