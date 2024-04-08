/* eslint-disable react-refresh/only-export-components */
import { useLoaderData, redirect } from "react-router-dom";
import TaskItem from "../../components/tasks/TaskItem";
import fetchAPI from "../../api/fetch";
import TaskActions from "../../components/tasks/TaskActions";
import appendAlert from "../../utils/alert";
import Attachments from "../../components/tasks/Attachments";
import Comments from "../../components/tasks/Comments";

export async function loader({ params }) {
  const data = await fetchAPI(`api/task/${parseInt(params.taskId)}`);
  return data ? data : null;
}

export async function action({ request, params }) {
  const formData = await request.formData();
  switch (request.method) {
    case "POST": {
      const objectToCreate = formData.get("objectToCreate");
      if (objectToCreate === "attachment") {
        const fileInput = document.querySelector('input[name="attachments"]');
        if (!fileInput.files.length) {
          return { error: "You must select a file to upload" };
        }
        // Append the files to the formData object
        for (const file of fileInput.files) {
          formData.append("attachments", file);
        }
        const response = await fetchAPI(`api/attachments/${params.taskId}`, {
          method: "POST",
          body: formData,
        });

        return response ? response : null;
      } else {
        const text = formData.get("text");
        if (!text) {
          return { error: "You must enter a comment." };
        }
        const response = await fetchAPI(`api/task/comments`, {
          method: "POST",
          body: formData,
        });

        return response ? response : null;
      }
    }
    case "PATCH": {
      const response = await fetchAPI(`api/task/${params.taskId}`, {
        method: "PATCH",
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      return response ? response : null;
    }
    case "DELETE": {
      const objectToDelete = formData.get("objectToDelete");
      if (objectToDelete === "task") {
        if (window.confirm("Are you sure you want to delete this task?")) {
          const response = await fetchAPI(`api/task/${params.taskId}`, {
            method: "delete",
          });
          if (response.error) {
            appendAlert(response.error, "warning");
            return response.error;
          }
          appendAlert(response?.message, "success");

          return response.message
            ? redirect("/tasks")
            : { error: "The task could not be deleted." };
        }
        return null;
      } else if (objectToDelete === "comment") {
        if (window.confirm("Are you sure you want to delete this comment?")) {
          const id = formData.get("id");
          const response = await fetchAPI(`api/task/comments/${id}`, {
            method: "delete",
          });
          if (response?.error) {
            appendAlert(response.error, "warning");
            return response.error;
          }
          if (response?.message) {
            appendAlert(response?.message, "success");
            return null;
          }

          return { error: "The comment could not be deleted." };
        }
        return null;
      } else {
        const id = formData.get("id");
        if (
          window.confirm("Are you sure you want to delete this attachment?")
        ) {
          const response = await fetchAPI(`api/attachments/${id}`, {
            method: "delete",
          });
          if (response?.error) {
            appendAlert(response.error, "warning");
            return response.error;
          }
          if (response?.message) {
            appendAlert(response?.message, "success");
            return null;
          }

          return { error: "The attachment could not be deleted." };
        }
        return null;
      }
    }
    default: {
      throw new Response("", { status: 405 });
    }
  }
}

const TaskDetail = () => {
  const { task } = useLoaderData() || {};
  return (
    <div className="container">
      {task ? (
        <>
          <TaskItem task={task} />

          <div className="row-md-10 justify-content-center align-items-center">
            <h4 className="mb-4">Attachments</h4>
            <hr className="border border-2 border-secondary mb-4" />
            <Attachments attachments={task?.attachments} />
          </div>
          <div className="row-md-10 justify-content-center align-items-center">
            <h4 className="mb-3">Comments</h4>
            <hr className="border border-2 border-secondary mb-4" />
            <Comments comments={task?.comments} taskId={task.id} />
          </div>
          <div className="row-md-10 justify-content-center align-items-center">
            <h4 className="mb-3">Actions</h4>
            <hr className="border border-2 border-secondary mb-4" />
            <TaskActions task={task} />
          </div>
        </>
      ) : (
        <h4 className="text-center">The task could not be found.</h4>
      )}
    </div>
  );
};

export default TaskDetail;
