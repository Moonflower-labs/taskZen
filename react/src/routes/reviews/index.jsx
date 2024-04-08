/* eslint-disable react-refresh/only-export-components */
import { Link, useRouteLoaderData } from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import ReviewListItem from "../../components/reviews/ReviewListItem";
import CreateReview from "../../components/reviews/CreateReview";
import fetchAPI from "../../api/fetch";
import appendAlert from "../../utils/alert";
import Pagination from "../../components/Pagination";

export async function loader({ request }) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || 1;
  const { reviews, tasks, totalPages } = await fetchAPI(
    `api/review/list?page=${page}`
  );

  return { reviews, tasks, totalPages } || null;
}
export async function action({ request }) {
  switch (request.method) {
    case "POST": {
      const formData = await request.formData();
      const response = await fetchAPI("api/review", {
        method: "post",
        body: formData,
      });
      return response ?? null;
    }
    case "DELETE": {
      const formData = await request.formData();
      const reviewId = formData.get("id");
      if (window.confirm("Are you sure you want to delete this task?")) {
        const response = await fetchAPI(`api/review/${reviewId}`, {
          method: "delete",
        });
        if (response?.error) {
          appendAlert(response.error, "warning");
          return response.error;
        }
        if (!response) {
          appendAlert("An error has ocurred", "warning");
          return null;
        }
        appendAlert(response?.message, "success");

        return response ? response.message : null;
      }
      return null;
    }
    default: {
      throw new Response("", { status: 405 });
    }
  }
}
const Reviews = () => {
  const { reviews, tasks, totalPages } = useLoaderData() || {};
  const { isAdmin } = useRouteLoaderData("root") || false;
  return (
    <div className="container">
      <div className="d-flex  justify-content-between align-items-center mb-4 p-2">
        <h1>Reviews</h1>
        {isAdmin && (
          <button
            className="btn btn-primary position-relative"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#reviewTaskModal"
            disabled={tasks?.length === 0}
          >
            {tasks?.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {tasks.length}
                <span className="visually-hidden">tasks to review</span>
              </span>
            )}
            Review a task
          </button>
        )}
      </div>
      <hr className="border border-2 border-primary mb-4" />

      {isAdmin && (
        <div className=" col-md-6">
          {/*   Modal   */}
          <CreateReview tasks={tasks} />
          <h3 className="mb-3">
            {tasks?.length > 0 ? "Tasks for review" : "No tasks to review."}
          </h3>
          <ol className="list-group list-group-numbered list-group-flush mb-3">
            {tasks &&
              tasks.map((task) => (
                <li key={task.id} className="list-group-item">
                  <Link to={`/tasks/${task.id}`} className="task">
                    {task.title}
                  </Link>
                </li>
              ))}
          </ol>
        </div>
      )}
      {reviews.length ? (
        <>
          <div className="table-responsive">
            <table className="table  text-center align-middle">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Comments</th>
                  <th scope="col">Date</th>
                  <th scope="col">Task</th>
                  <th scope="col">Status</th>
                  {isAdmin && <th scope="col">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <ReviewListItem key={review.id} review={review} />
                ))}
              </tbody>
            </table>
          </div>
          <Pagination totalPages={totalPages} linkTo={"reviews"} />
        </>
      ) : (
        <p className="text-center">No reviews to display yet.</p>
      )}
    </div>
  );
};

export default Reviews;
