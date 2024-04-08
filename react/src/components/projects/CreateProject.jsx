/* eslint-disable react/prop-types */
import { useFetcher } from "react-router-dom";
import { useRef, useEffect } from "react";
import { Modal } from "bootstrap";
import getCookie from "../../utils/cookie";
import appendAlert from "../../utils/alert";

const CreateProject = (tasksList) => {
  const fetcher = useFetcher();
  const csrfToken = getCookie("csrftoken") || "";
  let projectFormRef = useRef(null);
  let projectModalRef = useRef(null);
  const tasks = tasksList?.tasks;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.message) {
      let modal = Modal.getOrCreateInstance(projectModalRef.current);
      modal.hide(); // Hide the modal
      projectFormRef.current?.reset(); // Reset the form
      // Display a message to the user
      appendAlert(fetcher.data.message, "success");
    }
  }, [fetcher.state, fetcher.data]);

  return (
    //     Modal
    <div
      ref={projectModalRef}
      className="modal fade"
      id="createProjectModal"
      tabIndex="-1"
      aria-labelledby="createProjectLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="createProjectLabel">
              Create a new project
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <fetcher.Form
            method="post"
            action="/projects/create"
            ref={projectFormRef}
          >
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
              <div className="mb-3">
                <label htmlFor="tasks" className="ms-4 mb-3">
                  Add tasks
                </label>
                <select
                  className="form-select mb-3"
                  aria-label="Default select example"
                  name="tasks"
                  id="tasks"
                  multiple
                  size={"4"}
                >
                  {tasks && tasks.length ? (
                    tasks.map((task) => (
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
                <div className="text-center text-body-tertiary fw-semibold">
                  Hold control/command to select multiple tasks.
                </div>
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

export default CreateProject;
