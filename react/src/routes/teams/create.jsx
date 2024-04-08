import fetchAPI from "../../api/fetch";
import appendAlert from "../../utils/alert";

export async function action({ request }) {
  let formData = await request.formData();
  const name = formData.get("name");
  if (!name) {
    return { error: "You must enter a name." };
  }
  const response = await fetchAPI("api/team", {
    method: "post",
    body: formData,
  });
  if (response.error) {
    appendAlert(response.error, "warning");
    return response.error;
  }

  return response ? response : null;
}
