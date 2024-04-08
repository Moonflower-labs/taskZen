import { projectProps } from "../../utils/propTypes";
import { Link, useFetcher, useRouteLoaderData } from "react-router-dom";
import { IoCheckmarkDone } from "react-icons/io5";
import Progress from "../Progress";
import { GrInProgress } from "react-icons/gr";
import { SiCodereview } from "react-icons/si";
import { ImBin } from "react-icons/im";
import getCookie from "../../utils/cookie";

const ProjectItem = ({ project }) => {
  const { isAdmin, user } = useRouteLoaderData("root") || {};
  const isAuthor = project.project_manager === user.username || false;
  const fetcher = useFetcher();
  const csrfToken = getCookie("csrftoken") || "";
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>{project.title}</h4>
        <div>
          <p>Project manager: {project.project_manager}</p>
        </div>
        {isAdmin && isAuthor && (
          <div className="d-flex gap-3">
            <Link
              to={`/projects/${project.id}/edit`}
              className="btn btn-success border border-secondary shadow"
            >
              Edit
            </Link>
            <fetcher.Form method="delete" className="text-center w-50">
              <input
                type="hidden"
                name="csrfmiddlewaretoken"
                value={csrfToken}
              />
              <button
                className="btn btn-outline-danger shadow mx-auto w-100"
                type="submit"
                name="id"
                value={project.id}
              >
                <ImBin />
              </button>
            </fetcher.Form>
          </div>
        )}
      </div>

      {project.tasks && project.tasks.length > 0 && (
        <Progress tasks={project.tasks} />
      )}
      <div className="pt-3">
        <h4>Description</h4>
        <hr className="border border-2 border-primary mb-4" />
        {project.description ? (
          <p className="description p-2 mb-4 ">{project.description}</p>
        ) : (
          <p className="text-center">No description provided.</p>
        )}{" "}
      </div>
      <div>
        <div className="d-flex justify-content-between">
          <h4>Tasks</h4>
          <p className="badge text-bg-primary">Count: {project.tasks.length}</p>
        </div>
        <hr className="border border-2 border-primary mb-4" />
        <ul className="list-group mb-4">
          {project.tasks && project.tasks.length ? (
            project.tasks.map((task) => (
              <li
                key={task.id}
                className="d-flex justify-content-between align-items-center list-group-item"
              >
                <Link to={`/tasks/${task.id}`} className="task">
                  {task.title}
                </Link>

                {task.status === "Pending" ? (
                  <GrInProgress size={25} className="text-primary" />
                ) : task.status === "Complete" ? (
                  <IoCheckmarkDone size={25} className="text-success" />
                ) : (
                  <SiCodereview size={25} className="text-warning" />
                )}
              </li>
            ))
          ) : (
            <p className="text-center">No tasks associated to this project.</p>
          )}
        </ul>
      </div>
    </>
  );
};

export default ProjectItem;

ProjectItem.propTypes = projectProps;
