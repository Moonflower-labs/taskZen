/* eslint-disable react-refresh/only-export-components */
import {
  useLoaderData,
  useRouteLoaderData,
  useNavigation,
} from "react-router-dom";
import Tasklist from "../../components/tasks/Tasklist";
import CreateTask from "../../components/tasks/CreateTask";
import Pagination from "../../components/Pagination";
import fetchAPI from "../../api/fetch";
import appendAlert from "../../utils/alert";
import { fetchTasks } from "../../api/fetch";
import TaskTableSkeleton from "../../components/skeletons/TaskTableSkeleton";
import TaskFilters from "../../components/tasks/TaskFilters";

export async function loader({ request }) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || 1;

  let queryParams = {};
  for (const param of url.searchParams.entries()) {
    if (param[0] !== "page" && param[1] !== "") {
      queryParams[param[0]] = param[1];
    }
  }

  const data = await fetchTasks(page, queryParams);

  return data ? data : null;
}

export async function action({ request }) {
  switch (request.method) {
    case "PATCH": {
      const formData = await request.formData();
      const taskId = formData.get("id");
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
      const taskId = formData.get("id");
      if (window.confirm("Are you sure you want to delete this task?")) {
        const response = await fetchAPI(`api/task/${taskId}`, {
          method: "delete",
        });
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

const Tasks = () => {
  const { tasks, totalPages, employees } = useLoaderData() || {};
  const { isAdmin } = useRouteLoaderData("root") || false;
  const navigation = useNavigation();

  return (
    <div className="container">
      <div className="d-flex  justify-content-between align-items-center mb-4 p-2">
        <h1>Tasks</h1>

        {isAdmin && (
          <button
            className="btn btn-primary"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#createTaskModal"
          >
            Add a new task
          </button>
        )}
      </div>
      <TaskFilters isAdmin={isAdmin} />
      <hr className="border border-2 border-primary mb-4" />
      {/*   Modal   */}
      <CreateTask employees={employees} />
      {navigation.state === "loading" ? (
        <TaskTableSkeleton />
      ) : (
        <Tasklist tasks={tasks} totalPages={totalPages} />
      )}

      <Pagination totalPages={totalPages} linkTo={"tasks"} />
    </div>
  );
};

export default Tasks;
