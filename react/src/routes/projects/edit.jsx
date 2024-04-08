/* eslint-disable react-refresh/only-export-components */
import {
  Form,
  useLoaderData,
  useNavigation,
  redirect,
  useActionData,
} from "react-router-dom";
import fetchAPI from "../../api/fetch";
import getCookie from "../../utils/cookie";
import appendAlert from "../../utils/alert";

export async function loader({ params }) {
  const data = await fetchAPI(`api/project/${params.projectId}?taskslist=true`);

  return data ? data : null;
}
export async function action({ request, params }) {
  const formData = await request.formData();
  const tasks = Array.from(formData.getAll("tasks"));
  const form = Object.fromEntries(formData);
  form.tasks = tasks;
  const response = await fetchAPI(`api/project/${Number(params.projectId)}`, {
    method: "PUT",
    body: JSON.stringify(form),
  });
  if (!response) {
    return { error: "An error has ocurred" };
  }
  if (response.error) {
    appendAlert(response.error, "warning");
    return response.error;
  }
  appendAlert(response?.message, "success");
  return response.message
    ? redirect(`/projects/${params.projectId}`)
    : { error: "An error has ocurred and the project could no be edited." };
}

const EditProject = () => {
  const { project, taskList } = useLoaderData();
  const csrfToken = getCookie("csrftoken") || "";
  const navigation = useNavigation();
  const isEditing = navigation.state === "submitting";
  const actionData = useActionData();

  return (
    <div className="container">
      <div className="row">
        <h2 className="text-center my-5">Edit project</h2>
        {project && (
          <div className="col-md-8 mx-auto">
            <Form method="post">
              <input
                type="hidden"
                name="csrfmiddlewaretoken"
                value={csrfToken}
              />
              <div className="mx-2">
                <div className="form-floating">
                  <input
                    id="title"
                    type="text"
                    name="title"
                    className="form-control mb-3"
                    defaultValue={project.title}
                  />
                  <label htmlFor="title" className="form-label mb-3">
                    Title
                  </label>
                </div>
                <div className="form-floating mb-3">
                  <textarea
                    id="description"
                    className="form-control"
                    name="description"
                    style={{ height: "100px" }}
                    defaultValue={project.description}
                  ></textarea>
                  <label htmlFor="description">Description</label>
                </div>
                <div className="mb-3">
                  <label htmlFor="tasks" className="ms-4 mb-3">
                    Add tasks
                  </label>
                  <div className="text-center text-body-tertiary fw-semibold mb-3">
                    - Hold control or command to select or unselect multiple
                    tasks.
                  </div>
                  <select
                    className="form-select mb-3"
                    aria-label="Default select example"
                    name="tasks"
                    id="tasks"
                    defaultValue={project.tasks.map((task) => task.id)}
                    multiple
                    size={"20"}
                  >
                    {taskList && taskList.length ? (
                      taskList.map((task) => (
                        <option value={task.id} key={task.id}>
                          {task.title}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No tasks available
                      </option>
                    )}
                  </select>
                </div>
              </div>
              {actionData && actionData.error ? (
                <p className="text-center text-danger">{actionData.error}</p>
              ) : null}
              <div className="text-center">
                <button type="submit" className="btn btn-outline-primary mb-4">
                  {isEditing ? (
                    <div className="d-flex align-items-center gap-3">
                      <div>Saving changes</div>
                      <div
                        className="spinner-border spinner-border-sm text-secondary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    "Save changes"
                  )}
                </button>
              </div>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProject;
