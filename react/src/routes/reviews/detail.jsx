/* eslint-disable react-refresh/only-export-components */
import { redirect, useLoaderData } from "react-router-dom";
import ReviewItem from "../../components/reviews/ReviewItem";
import fetchAPI from "../../api/fetch";
import appendAlert from "../../utils/alert";

export async function loader({ params }) {
  const data = await fetchAPI(`api/review/${params.reviewId}`);

  return data ? data : null;
}
export async function action({ params, request }) {
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
      if (window.confirm("Are you sure you want to delete this project?")) {
        const response = await fetchAPI(`api/review/${params.reviewId}`, {
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
        appendAlert(response.message, "success");
        return redirect("/reviews");
      }
      return null;
    }
    default: {
      throw new Response("", { status: 405 });
    }
  }
}

const ReviewtDetail = () => {
  const review = useLoaderData();

  return (
    <div className="container">
      {review ? (
        <ReviewItem review={review} />
      ) : (
        <h4 className="text-center">No review found with the requested id.</h4>
      )}
    </div>
  );
};

export default ReviewtDetail;
