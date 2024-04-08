/* eslint-disable react/prop-types */
import { useFetcher } from "react-router-dom";
import { useRef, useEffect } from "react";
import { Modal } from "bootstrap";
import getCookie from "../../utils/cookie";
import appendAlert from "../../utils/alert";
const CreateTask = ({ employees }) => {
  const fetcher = useFetcher();
  const csrfToken = getCookie("csrftoken") || "";
  const defaultDueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
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
      id="createTaskModal"
      tabIndex="-1"
      aria-labelledby="createTaskLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="createTaskLabel">
              Add a new task
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <fetcher.Form method="post" action="/tasks/create" ref={formRef}>
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
                  name="title"
                  className="form-control mb-3"
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
                ></textarea>
                <label htmlFor="description">Description</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  id="due_date"
                  type="date"
                  name="due_date"
                  className="form-control mb-3"
                  defaultValue={defaultDueDate} // In 1 week
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
                  aria-label="Default select example"
                  name="visibility"
                  id="visibility"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
                <label htmlFor="visibility">Visibility</label>
              </div>
              <div className="form-floating mb-3">
                <select
                  className="form-select mb-3"
                  aria-label="Default select example"
                  name="assign_to"
                  id="assign_to"
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

export default CreateTask;
