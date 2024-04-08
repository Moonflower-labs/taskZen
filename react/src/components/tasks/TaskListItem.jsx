import { taskProps } from "../../utils/propTypes";
import { Link, useFetcher, useRouteLoaderData } from "react-router-dom";
import { FcOk, FcProcess } from "react-icons/fc";
import { SiCodereview } from "react-icons/si";
import { GrEdit } from "react-icons/gr";
import { ImBin } from "react-icons/im";
import { TbAlertTriangle } from "react-icons/tb";
import getCookie from "../../utils/cookie";

const TaskListItem = ({ task }) => {
  const { isAdmin, user } = useRouteLoaderData("root") || {};
  const isAuthor = task.created_by === user.username || false;
  const fetcher = useFetcher();
  const csrfToken = getCookie("csrftoken") || "";
  let status = fetcher.formData?.get("status") || task.status;
  let isComplete = status === "Complete";
  return (
    <tr
      className={`table-${
        task.status === "Complete"
          ? "success"
          : task.status === "Reviewing"
          ? "warning"
          : ""
      }`}
    >
      <th scope="row">{task.id}</th>
      <td>
        <Link to={`/tasks/${task.id}`} className="task">
          {task.title}
        </Link>
      </td>
      <td>
        <div className="d-flex text-nowrap justify-content-center">
          {task?.due_date}
          {new Date(task.due_date.split("-").reverse().join("-")) <=
            new Date() &&
            task.status === "Pending" && (
              <TbAlertTriangle
                size={25}
                className="ms-2 text-danger"
                title="Due date missed!"
              />
            )}
        </div>
      </td>
      <td>
        <div className="d-flex pe-5 pe-md-0 justify-content-around gap-4 gap-md-0">
          <div className="w-50 m-auto text-center">
            {task?.status === "Pending" ? (
              <FcProcess size={25} />
            ) : task?.status === "Reviewing" ? (
              <SiCodereview size={25} className="text-warning" />
            ) : (
              <FcOk size={25} />
            )}
          </div>
          {isAdmin && isAuthor && (
            <fetcher.Form method="patch" className="w-50">
              <input type="hidden" name="id" value={task.id} />
              <input
                type="hidden"
                name="csrfmiddlewaretoken"
                value={csrfToken}
              />
              <button
                className="btn btn-outline-secondary shadow text-nowrap"
                name="status"
                value={!isComplete ? "complete" : "pending"}
                type="submit"
              >
                {!isComplete ? "Mark complete" : "Unmark"}
              </button>
            </fetcher.Form>
          )}
        </div>
      </td>

      <td>
        {isAdmin && isAuthor ? (
          <div className="d-flex justify-content-around gap-3 gap-md-0">
            <Link to={`${task.id}/edit`} className="btn btn-success shadow">
              <GrEdit title="Edit" className="text-primary" />
            </Link>
            <fetcher.Form method="delete">
              <input
                type="hidden"
                name="csrfmiddlewaretoken"
                value={csrfToken}
              />
              <button
                className="btn btn-outline-danger shadow"
                type="submit"
                name="id"
                value={task.id}
              >
                <ImBin />
              </button>
            </fetcher.Form>
          </div>
        ) : (
          <>
            {(task?.attachments.length > 0 || task.status === "Reviewing") &&
            task.assigned_to === user.username ? (
              <fetcher.Form method="patch">
                <input
                  type="hidden"
                  name="csrfmiddlewaretoken"
                  value={csrfToken}
                />
                <input type="hidden" name="status" value="reviewing" />
                <button
                  className="btn btn-outline-primary shadow d-flex text-nowrap justify-content-center align-items-center mx-auto"
                  type="submit"
                  name="id"
                  value={task.id}
                  disabled={
                    task.status === "Reviewing" || task.status === "Complete"
                  }
                >
                  {task.status === "Reviewing"
                    ? "Review in progress"
                    : task.status === "Complete"
                    ? "Task completed"
                    : "Submit for review"}
                </button>
              </fetcher.Form>
            ) : (
              <p className="m-auto">
                {isAdmin
                  ? "No actions avaliable"
                  : "Upload assigment/s to submit."}
              </p>
            )}
          </>
        )}
      </td>
    </tr>
  );
};

export default TaskListItem;
TaskListItem.propTypes = taskProps;
