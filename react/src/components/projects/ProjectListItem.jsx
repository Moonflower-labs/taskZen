import { projectProps } from "../../utils/propTypes";
import { Link, useFetcher } from "react-router-dom";
import { ImBin } from "react-icons/im";
import { GrEdit } from "react-icons/gr";
import getCookie from "../../utils/cookie";

const ProjectListItem = ({ project }) => {
  const fetcher = useFetcher();
  const csrfToken = getCookie("csrftoken") || "";
  return (
    <>
      <tr>
        <th scope="row">{project.id}</th>
        <td>
          <Link to={`/projects/${project.id}`} className="project">
            {project.title}
          </Link>
        </td>
        <td>{project.tasks?.length}</td>
        <td>
          <div className="d-flex justify-content-around gap-3 gap-md-0">
            <Link to={`${project.id}/edit`} className="btn btn-success shadow">
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
                value={project.id}
              >
                <ImBin title="Delete" />
              </button>
            </fetcher.Form>
          </div>
        </td>
      </tr>
    </>
  );
};

export default ProjectListItem;

ProjectListItem.propTypes = projectProps;
