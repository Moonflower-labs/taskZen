/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Progress from "../Progress";

const ProjectCard = ({ projects }) => {
  return (
    <div className="col-md-8 border border-2 bg-body-tertiary rounded-2 p-3 mb-3 mb-3 mx-auto">
      <h5 className="mb-3 text-center">
        <p className="h4">
          Recently added{" "}
          <Link to={"/projects"} className="task">
            projects
          </Link>
        </p>
      </h5>
      <ul className="list-group list-group-flush">
        {projects && projects.length ? (
          projects.map((project) => (
            <li
              key={project.id}
              className="list-group-item-action list-group-item"
            >
              <h5 className="d-flex  flex-row justify-content-between align-items-center">
                <Link className="task w-50" to={`/projects/${project.id}`}>
                  {project.title}
                </Link>
                <div className="w-50 mb-0">
                  <Progress tasks={project?.tasks} />
                  <div className="text-center text-sm">
                    {project.tasks && project.tasks.length} tasks
                  </div>
                </div>
              </h5>
            </li>
          ))
        ) : (
          <p className="text-center h5">No projects to display.</p>
        )}
      </ul>
    </div>
  );
};

export default ProjectCard;
