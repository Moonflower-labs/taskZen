/* eslint-disable react-refresh/only-export-components */
import { useLoaderData, redirect } from "react-router-dom";
import ProjectItem from "../../components/projects/ProjectItem";
import fetchAPI from "../../api/fetch";
import appendAlert from "../../utils/alert";

export async function loader({ params }) {
  const project = await fetchAPI(`api/project/${params.projectId}`);

  return project ? project : null;
}
export async function action({ params }) {
  if (window.confirm("Are you sure you want to delete this project?")) {
    const response = await fetchAPI(`api/project/${params.projectId}`, {
      method: "delete",
    });
    if (response.error) {
      appendAlert(response.error, "warning");
      return response.error;
    }
    appendAlert(response?.message, "success");

    return response.message
      ? redirect("/projects")
      : { error: "The project could not be deleted." };
  }
  return null;
}

const ProjectDetail = () => {
  const project = useLoaderData();

  return (
    <div className="container">
      {project ? (
        <ProjectItem project={project} />
      ) : (
        <h4 className="text-center">No project found with the requested id.</h4>
      )}
    </div>
  );
};

export default ProjectDetail;
