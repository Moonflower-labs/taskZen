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
  const data = await fetchAPI(`api/team/${params.teamId}`);

  return data ? data : null;
}
export async function action({ request, params }) {
  const formData = await request.formData();
  const members = Array.from(formData.getAll("employees"));
  const form = Object.fromEntries(formData);
  form.employees = members;
  const response = await fetchAPI(`api/team/${Number(params.teamId)}`, {
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
    ? redirect(`/teams/${params.teamId}`)
    : { error: "An error has ocurred and the team could no be edited." };
}

const EditTeam = () => {
  const { team, employees } = useLoaderData() || {};
  const csrfToken = getCookie("csrftoken") || "";
  const navigation = useNavigation();
  const isEditing = navigation.state === "submitting";
  const actionData = useActionData();

  return (
    <div className="container">
      <div className="row">
        <h2 className="text-center my-5">Edit team</h2>
        {team && (
          <div className="col-md-8 mx-auto">
            <Form method="put">
              <div className="modal-body">
                <input
                  type="hidden"
                  name="csrfmiddlewaretoken"
                  value={csrfToken}
                />
              </div>
              <div className="mx-2">
                <div className="form-floating">
                  <input
                    id="title"
                    type="text"
                    name="name"
                    className="form-control mb-3"
                    defaultValue={team.name}
                  />
                  <label htmlFor="title" className="form-label mb-3">
                    Name
                  </label>
                </div>
                <div className="form-floating mb-3">
                  <textarea
                    id="description"
                    className="form-control"
                    name="description"
                    style={{ height: "100px" }}
                    defaultValue={team.description}
                  ></textarea>
                  <label htmlFor="description">Description</label>
                </div>
                <div className="mb-3">
                  <label htmlFor="tasks" className="ms-4 mb-3">
                    Add or remove employees
                  </label>
                  <select
                    className="form-select mb-3"
                    aria-label="Default select example"
                    name="employees"
                    id="employees"
                    defaultValue={team.members.map((member) => member.id)}
                    multiple
                    size={"4"}
                  >
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
                  <div className="text-center text-body-tertiary fw-semibold">
                    Hold control/command to select multiple employees.
                  </div>
                </div>
                {actionData?.error && (
                  <div className="text-danger text-center mb-3">
                    {actionData.error}
                  </div>
                )}
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-outline-primary">
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

export default EditTeam;
