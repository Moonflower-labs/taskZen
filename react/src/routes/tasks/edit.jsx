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
  const data = await fetchAPI(`api/task/${params.taskId}`);

  return data ? data : null;
}
export async function action({ request, params }) {
  const formData = await request.formData();
  const response = await fetchAPI(`api/task/${Number(params.taskId)}`, {
    method: "PUT",
    body: JSON.stringify(Object.fromEntries(formData)),
  });
  if (response?.error) {
    appendAlert(response.error, "warning");
    return response.error;
  }
  appendAlert(response?.message, "success");
  return response.message
    ? redirect(`/tasks/${params.taskId}`)
    : { error: "An error has ocurred and the task could no be edited." };
}

const EditTask = () => {
  const { task, employees } = useLoaderData() || {};
  const csrfToken = getCookie("csrftoken") || "";
  const navigation = useNavigation();
  const isEditing = navigation.state === "submitting";
  const actionData = useActionData();
  const formattedDate = task?.due_date
    ? task.due_date.split("-").reverse().join("-")
    : "";
  return (
    <div className="container">
      <div className="row">
        <h2 className="text-center my-5">Edit task</h2>
        {task && (
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
                    defaultValue={task?.title}
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
                    defaultValue={task?.description}
                  ></textarea>
                  <label htmlFor="description">Description</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    id="due_date"
                    type="date"
                    name="due_date"
                    className="form-control mb-3"
                    defaultValue={formattedDate}
                  />
                  <label htmlFor="due_date" className="form-label mb-3">
                    Due by
                  </label>
                </div>{" "}
                <div className="form-floating mb-3">
                  <select
                    className="form-select mb-3"
                    aria-label="Default select example"
                    name="priority"
                    id="priority"
                    defaultValue={task?.priority}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <label htmlFor="priority">Priority</label>
                </div>
                <div className="form-floating mb-3">
                  <select
                    className="form-select mb-3"
                    aria-label="employee select"
                    name="assign_to"
                    id="assign_to"
                    defaultValue={
                      employees && employees.length
                        ? employees.find(
                            (employee) => employee.username === task.assigned_to
                          )?.id || ""
                        : ""
                    }
                  >
                    <option value="">None</option>
                    {employees && employees.length ? (
                      employees.map((employee) => (
                        <option value={employee.id} key={employee.id}>
                          {employee.username}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No employees available.
                      </option>
                    )}
                  </select>
                  <label htmlFor="assign_to" className="mb-3">
                    Assign to employee
                  </label>
                </div>
                <div className="form-floating mb-3">
                  <select
                    className="form-select mb-3"
                    aria-label="Default select example"
                    name="visibility"
                    id="visibility"
                    defaultValue={task.visibility}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                  <label htmlFor="visibility">Visibility</label>
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

export default EditTask;
