import { taskProps } from "../../utils/propTypes";
import { useRef } from "react";
import { Form, useRouteLoaderData, useSubmit } from "react-router-dom";
import { FcOk, FcProcess } from "react-icons/fc";
import { SiCodereview } from "react-icons/si";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { TbAlertTriangle } from "react-icons/tb";

const TaskItem = ({ task }) => {
  const { isAdmin } = useRouteLoaderData("root") || false;
  const submit = useSubmit();
  const formRef = useRef(null);

  const handleCheckboxChange = () => {
    const visibility = formRef.current.visibility.checked; // Get the current value of the checkbox
    submit({ visibility }, { method: "patch" }); // Use the obtained visibility value in the submit function
  };

  return (
    <>
      <div className="row justify-content-center align-items-center">
        <div className="col p-2 border border-2 text-center mb-5">
          <div className="d-flex align-items-">
            <h3 className="my-auto w-50">{task.title}</h3>
            <div className="w-25 d-flex justify-content-end">
              <span className="d-none d-md-block">Status</span>
              <span className="ms-3">
                {task?.status === "Pending" ? (
                  <FcProcess title="Pending" size={24} />
                ) : task?.status === "Reviewing" ? (
                  <SiCodereview size={25} className="text-warning" />
                ) : (
                  <FcOk size={25} />
                )}
              </span>
            </div>
            {isAdmin && (
              <div className="d-flex flex-colu flex-md-row justify-content-end mx-auto  gap-2 w-25">
                {task.visibility === "public" ? (
                  <MdVisibility
                    size={26}
                    title="Public"
                    className="text-success"
                  />
                ) : (
                  <MdVisibilityOff
                    size={26}
                    title="Private"
                    className="text-warning"
                  />
                )}
                <Form method="patch" ref={formRef}>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input shadow-none"
                      type="checkbox"
                      role="switch"
                      id="visibility"
                      name="visibility"
                      onChange={handleCheckboxChange}
                      defaultChecked={task.visibility === "public"}
                    />
                    <label
                      className="form-check-label m-auto d-none d-md-block me-2"
                      htmlFor="visibility"
                    >
                      {task.visibility === "public" ? "Public" : "Private"}
                    </label>
                  </div>
                </Form>
              </div>
            )}
          </div>
          <hr className="border border-2 border-primary" />
          <div className="row">
            <div className="col-md-8">
              {task.description ? (
                <p className="description">{task.description}</p>
              ) : (
                <p className="m-auto border-2 border-primary border-end">
                  No description provided.
                </p>
              )}
            </div>
            <div className="col-md-4">
              <div>
                Due by: {task.due_date}
                {new Date(task.due_date.split("-").reverse().join("-")) <=
                  new Date() &&
                  task.status === "Pending" && (
                    <TbAlertTriangle size={25} className="ms-2 text-danger" />
                  )}
              </div>
              <div>Priority {task.priority}</div>
              <div>Assigned to: {task.assigned_to}</div>
              <div>Created by: {task.created_by}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskItem;

TaskItem.propTypes = taskProps;
