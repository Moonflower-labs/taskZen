/* eslint-disable react/prop-types */
import { useFetcher } from "react-router-dom";
import { useRef, useEffect } from "react";
import { Modal } from "bootstrap";
import getCookie from "../../utils/cookie";
import appendAlert from "../../utils/alert";
const CreateReview = ({ tasks }) => {
  const fetcher = useFetcher();
  const csrfToken = getCookie("csrftoken") || "";
  let formRef = useRef(null);
  let modalRef = useRef(null);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.message) {
      let modal = Modal.getOrCreateInstance(modalRef.current);
      modal.hide(); // Hide the modal
      formRef.current?.reset(); // Reset the form
      // Display a message to the user
      appendAlert(fetcher.data.message, "success");
    }
  }, [fetcher.state, fetcher.data]);

  return (
    //     Modal
    <div
      ref={modalRef}
      className="modal fade"
      id="reviewTaskModal"
      tabIndex="-1"
      aria-labelledby="reviewTaskLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="createTaskLabel">
              Review a task
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <fetcher.Form method="post" ref={formRef}>
            <div className="form-floating mb-3">
              <select
                className="form-select mb-3"
                aria-label="Default select example"
                name="taskId"
                id="taskId"
              >
                <option value="">None</option>
                {tasks && tasks.length ? (
                  tasks.map((task) => (
                    <option value={task.id} key={task.id}>
                      {task.title}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No tasks available for review.
                  </option>
                )}
              </select>
              <label htmlFor="taskId" className="mb-3">
                Select task to review
              </label>
            </div>
            <div className="modal-body">
              <input
                type="hidden"
                name="csrfmiddlewaretoken"
                value={csrfToken}
              />
            </div>
            <div className="mx-2">
              <div className="form-floating mb-3">
                <textarea
                  id="comments"
                  className="form-control"
                  name="comments"
                  style={{ height: "100px" }}
                ></textarea>
                <label htmlFor="comments">Comments</label>
              </div>
              <div className="form-floating mb-3">
                <select
                  className="form-select mb-3"
                  aria-label="Default select example"
                  name="status"
                  id="status"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <label htmlFor="status">Status</label>
              </div>

              {fetcher.data?.error && (
                <div className="text-danger text-center mb-3">
                  {fetcher.data.error}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="submit" className="btn btn-outline-primary">
                Create
              </button>
            </div>
          </fetcher.Form>
        </div>
      </div>
    </div>
  );
};

export default CreateReview;
