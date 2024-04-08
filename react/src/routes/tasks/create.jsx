import fetchAPI from "../../api/fetch";

export async function action({ request }) {
  let formData = await request.formData();
  const title = formData.get("title");
  const dueDate = formData.get("due_date");
  if (!title) {
    return { error: "You must enter a title." };
  }
  if (!dueDate) {
    return { error: "You must enter a due date." };
  }
  const response = await fetchAPI("api/task", {
    method: "post",
    body: formData,
  });
  if (response.error) {
    return { error: response.error };
  }
  if (!response) {
    return { error: "An error has ocurred while attempting to create a task." };
  }

  return response;
}
