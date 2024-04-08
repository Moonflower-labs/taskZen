/* eslint-disable react/prop-types */
import { useFetcher } from "react-router-dom";
import { useRef, useEffect } from "react";
import { Modal } from "bootstrap";
import getCookie from "../../utils/cookie";
import appendAlert from "../../utils/alert";
const CreateTeam = ({ employees }) => {
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
      id="createTaskModal"
      tabIndex="-1"
      aria-labelledby="createTaskLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="createTaskLabel">
              Add a new Team
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <fetcher.Form method="post" action="/teams/create" ref={formRef}>
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
                ></textarea>
                <label htmlFor="description">Description</label>
              </div>
              <div className="mb-3">
                <label htmlFor="tasks" className="ms-4 mb-3">
                  Add employees
                </label>
                <select
                  className="form-select mb-3"
                  aria-label="Default select example"
                  name="employees"
                  id="employees"
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

export default CreateTeam;
