import { useEffect, useRef } from "react";
import { taskProps } from "../../utils/propTypes";
import { Link, useFetcher, useRouteLoaderData } from "react-router-dom";
import { ImBin } from "react-icons/im";
import { IoMdAttach } from "react-icons/io";
import getCookie from "../../utils/cookie";
import appendAlert from "../../utils/alert";

const TaskActions = ({ task }) => {
  const { isAdmin, user } = useRouteLoaderData("root") || {};
  const isAuthor = task.created_by === user.username || false;
  const isAsignee = task.assign_to === user.username || false;
  const fetcher = useFetcher();
  const csrfToken = getCookie("csrftoken") || "";
  let status = fetcher.formData?.get("status") || task.status;
  let isComplete = status === "Complete";
  let uploadFormRef = useRef(null);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.message) {
      uploadFormRef.current?.reset(); // Reset the form
      // Display a message to the user
      appendAlert(fetcher.data.message, "success");
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <div className="row align-items-center mb-4">
      <div className="col-md-3 my-auto mb-3">
        {task?.attachments.length > 0 || task.status === "Reviewing" ? (
          <fetcher.Form method="patch" className="w-100">
            <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
            <input type="hidden" name="status" value="reviewing" />
            <button
              className="btn btn-outline-primary shadow w-100"
              type="submit"
              name="id"
              value={task.id}
              disabled={task.status === "Reviewing"}
            >
              {task.status === "Reviewing"
                ? "Review in progress"
                : "Submit for review"}
            </button>
          </fetcher.Form>
        ) : (
          <p className="m-auto text-center">
            {isAsignee || isAuthor
              ? "Upload assigment/s to submit"
              : "Not allowed to submit"}
            .
          </p>
        )}
      </div>
      {isAdmin && isAuthor && (
        <>
          <div className="col-md-3 mb-3">
            <div className="d-flex justify-content-evenly gap-2">
              <fetcher.Form method="patch" className="w-100 text-center">
                <input type="hidden" name="id" value={task.id} />
                <input
                  type="hidden"
                  name="csrfmiddlewaretoken"
                  value={csrfToken}
                />
                <button
                  className="btn btn-outline-secondary text-black shadow text-nowrap w-100"
                  name="status"
                  value={!isComplete ? "complete" : "pending"}
                  type="submit"
                >
                  {!isComplete ? "Mark complete" : "Unmark"}
                </button>
              </fetcher.Form>
            </div>
          </div>
          <div className="col-md-6 mb-3 text-center d-flex gap-2 justify-content-center">
            <Link
              to={`edit`}
              className="btn btn-success border border-secondary shadow w-50"
            >
              Edit
            </Link>
            <fetcher.Form method="delete" className="text-center w-50">
              <input
                type="hidden"
                name="csrfmiddlewaretoken"
                value={csrfToken}
              />
              <input type="hidden" name="objectToDelete" value={"task"} />
              <button
                className="btn btn-outline-danger shadow mx-auto w-100"
                type="submit"
                name="id"
                value={task.id}
              >
                <ImBin />
              </button>
            </fetcher.Form>
          </div>
        </>
      )}

      <div className="col-md-6 text-center mx-auto mb-3">
        {isAsignee ||
          (isAdmin && (
            <fetcher.Form method="post" ref={uploadFormRef}>
              <input
                type="hidden"
                name="csrfmiddlewaretoken"
                value={csrfToken}
              />
              <input type="hidden" name="objectToCreate" value={"attachment"} />
              <div className="d-flex gap-3">
                <input
                  className="form-control"
                  name="attachments"
                  type="file"
                  id="formFileMultiple"
                  multiple
                  disabled={task.status === "Reviewing"}
                />
                <button
                  className="btn btn-outline-success d-flex align-items-center gap-2 shadow mx-auto"
                  type="submit"
                  name="id"
                  value={task.id}
                  disabled={task.status === "Reviewing"}
                >
                  <span>Upload</span>
                  <IoMdAttach />
                </button>
              </div>
            </fetcher.Form>
          ))}
      </div>
      {fetcher.data?.error && (
        <div className="text-danger text-center my-3">{fetcher.data.error}</div>
      )}
    </div>
  );
};

export default TaskActions;

TaskActions.propTypes = taskProps;
