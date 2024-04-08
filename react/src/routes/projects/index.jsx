/* eslint-disable react-refresh/only-export-components */
import { useLoaderData } from "react-router-dom";
import fetchAPI from "../../api/fetch";
import ProjectListItem from "../../components/projects/ProjectListItem";
import Pagination from "../../components/Pagination";
import CreateProject from "../../components/projects/CreateProject";
import appendAlert from "../../utils/alert";

export async function loader({ request }) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || 1;
  const data = await fetchAPI(`api/project/list?page=${page}`);

  return data ? data : null;
}

export async function action({ request }) {
  switch (request.method) {
    case "PATCH": {
      const formData = await request.formData();
      const taskId = formData.get("taskId");
      const response = await fetchAPI(`api/task/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      if (!response) {
        appendAlert("An error has ocurred", "warning");
        return null;
      }
      if (response?.error) {
        appendAlert(response.error, "warning");
        return response.error;
      }

      return response;
    }
    case "DELETE": {
      const formData = await request.formData();
      const projectId = formData.get("id");
      if (window.confirm("Are you sure you want to delete this project?")) {
        const response = await fetchAPI(`api/project/${projectId}`, {
          method: "delete",
        });
        if (!response) {
          appendAlert("An error has ocurred", "warning");
          return null;
        }
        if (response.error) {
          appendAlert(response.error, "warning");
          return response.error;
        }

        appendAlert(response?.message, "success");

        return response ? response.message : null;
      } else {
        return null;
      }
    }
    default: {
      throw new Response("", { status: 405 });
    }
  }
}

const Projects = () => {
  const { projects, totalPages, taskList } = useLoaderData() || {};

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="p-2">Projects</h1>
        <button
          className="btn btn-primary"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#createProjectModal"
        >
          Create a project
        </button>
      </div>
      <hr className="border border-2 border-primary mb-4" />
      <CreateProject tasks={taskList} />
      {projects && projects.length ? (
        <div className="table-responsive">
          <table className="table table-hover table-border text-center align-middle">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Title</th>
                <th scope="col">Tasks</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects?.map((project) => (
                <ProjectListItem key={project.id} project={project} />
              ))}
            </tbody>
          </table>

          <Pagination totalPages={totalPages} linkTo={"projects"} />
        </div>
      ) : (
        <h4 className="text-center mt-5">No projects to show yet.</h4>
      )}
    </div>
  );
};

export default Projects;
