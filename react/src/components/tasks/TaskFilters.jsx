/* eslint-disable react/prop-types */
import { TbFilterSearch } from "react-icons/tb";
import { Modal } from "bootstrap";
import { useEffect, useRef } from "react";
import { useLocation, Form, useNavigation, Link } from "react-router-dom";

const TaskFilters = ({ isAdmin }) => {
  const location = useLocation();
  const formRef = useRef(null);
  const navigation = useNavigation();
  let modalRef = useRef(null);
  const searchParams = new URLSearchParams(location.search);
  const tasks = searchParams.get("tasks");
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const priority = searchParams.get("priority") || "all";
    const tasks =
      searchParams.get("tasks") || (isAdmin ? "created" : "assigned");
    const q = searchParams.get("q") || "";
    const status = searchParams.get("status") || "all";

    formRef.current.elements.priority.value = priority;
    formRef.current.elements.tasks.value = tasks;
    formRef.current.elements.q.value = q;
    formRef.current.elements.status.value = status;
    if (!location.search) {
      formRef.current.reset(); // Reset the form when there's no query string
    }
    if (searchParams.toString() || navigation.state == "loading") {
      let modal = Modal.getOrCreateInstance(modalRef.current);
      modal.hide(); // Hide the modal if the query string is present
    }
  }, [location.search, navigation.state, isAdmin]);

  return (
    <>
      {/*  Button trigger modal  */}
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#filtersModal"
        >
          <div className="d-flex align-items-center">
            <span className="">Filters</span>
            <TbFilterSearch size={24} />
          </div>
        </button>
        <div className="text-bold">
          {tasks ? tasks.toUpperCase() : isAdmin ? "CREATED" : "ASSIGNED"}
        </div>
      </div>

      {/* Modal  */}
      <div
        ref={modalRef}
        className="modal fade"
        id="filtersModal"
        tabIndex="-1"
        aria-labelledby="filtersModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <Form
                ref={formRef}
                className="d-flex flex-column gap-2 align-items-center"
              >
                <div className="w-100 form-floating">
                  <select
                    className="form-select mb-3"
                    aria-label="filter select"
                    name="priority"
                    id="priority"
                    defaultValue="all"
                  >
                    <option value="all">All</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <label htmlFor="priority" className="mb-3">
                    Priority
                  </label>
                </div>
                {isAdmin && (
                  <div className="w-100 form-floating">
                    <select
                      className="form-select mb-3"
                      aria-label="filter select"
                      name="visibility"
                      id="visibility"
                      defaultValue="public"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                    <label htmlFor="visibility" className="mb-3">
                      Visibility
                    </label>
                  </div>
                )}
                <div className="w-100 form-floating">
                  <select
                    className="form-select mb-3"
                    aria-label="task filter select"
                    name="tasks"
                    id="tasks"
                    defaultValue={isAdmin ? "created" : "assigned"}
                  >
                    <option value="all">All</option>
                    <option value={isAdmin ? "created" : "assigned"}>
                      {isAdmin ? "Created" : "Assigned"}
                    </option>
                    <option value="missed">Missed deadlines</option>
                  </select>
                  <label htmlFor="tasks" className="mb-3">
                    Other
                  </label>
                </div>
                <div className="w-100 form-floating">
                  <select
                    className="form-select mb-3"
                    aria-label="task filter select"
                    name="status"
                    id="status"
                    defaultValue="all"
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="complete">Complete</option>
                    <option value="reviewing">Reviewing</option>
                  </select>
                  <label htmlFor="status" className="mb-3">
                    Status
                  </label>
                </div>
                <div className="w-100 form-floating">
                  <input
                    aria-label="search title"
                    type="text"
                    name="q"
                    id="q"
                    className="form-control"
                  />
                  <label htmlFor="q">Search by title</label>
                </div>
                <div className="d-flex gap-3">
                  <Link to={"/tasks"} className="btn btn-secondary">
                    Reset filters
                  </Link>
                  <button type="submit" className="btn btn-primary">
                    Apply
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskFilters;
