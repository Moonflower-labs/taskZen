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
  const data = await fetchAPI(`api/review/${params.reviewId}?tasks=true`);

  return data ? data : null;
}
export async function action({ request, params }) {
  const formData = await request.formData();
  const response = await fetchAPI(`api/review/${params.reviewId}`, {
    method: "PUT",
    body: JSON.stringify(Object.fromEntries(formData)),
  });
  if (response?.error) {
    appendAlert(response.error, "warning");
    return response.error;
  }
  appendAlert(response?.message, "success");
  return response.message
    ? redirect(`/reviews/${params.reviewId}`)
    : { error: "An error has ocurred and the task could no be edited." };
}

const EditReview = () => {
  const { review, tasks } = useLoaderData() || {};
  const csrfToken = getCookie("csrftoken") || "";
  const navigation = useNavigation();
  const isEditing = navigation.state === "submitting";
  const actionData = useActionData();

  return (
    <div className="container">
      <div className="row">
        <h2 className="text-center my-5">Edit review</h2>
        {review && (
          <div className="col-md-8 mx-auto">
            <Form method="put">
              <input
                type="hidden"
                name="csrfmiddlewaretoken"
                value={csrfToken}
              />
              <div className="mx-2">
                <div className="form-floating mb-3">
                  <textarea
                    id="comments"
                    className="form-control"
                    name="comments"
                    style={{ height: "100px" }}
                    defaultValue={review?.comments}
                  ></textarea>
                  <label htmlFor="comments">Comments</label>
                </div>
                <div className="form-floating mb-3">
                  <select
                    className="form-select mb-3"
                    aria-label="employee select"
                    name="task"
                    id="task"
                    defaultValue={
                      tasks && tasks.length
                        ? tasks.find((task) => task.id === review.task.id)
                            ?.id || ""
                        : ""
                    }
                  >
                    <option value="">None</option>
                    {tasks && tasks.length ? (
                      tasks.map((task) => (
                        <option value={task.id} key={task.id}>
                          {task.title}
                        </option>
                      ))
                    ) : (
                      <option disabled>No tasks available.</option>
                    )}
                  </select>
                  <label htmlFor="task" className="mb-3">
                    Task to review
                  </label>
                </div>
                <div className="form-floating mb-3">
                  <select
                    className="form-select mb-3"
                    aria-label="employee select"
                    name="status"
                    id="status"
                    defaultValue={review?.status.toLowerCase()}
                  >
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="pending">Pending</option>
                  </select>
                  <label htmlFor="status" className="mb-3">
                    Status
                  </label>
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

export default EditReview;
