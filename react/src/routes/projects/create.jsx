import fetchAPI from "../../api/fetch";

export async function action({ request }) {
  let formData = await request.formData();
  const title = formData.get("title");
  if (!title) {
    return { error: "The project must have a title" };
  }
  const response = await fetchAPI("api/project", {
    method: "post",
    body: formData,
  });
  if (!response) {
    return {
      error: "An error has ocurred while attempting to create the project.",
    };
  }
  return response;
}
