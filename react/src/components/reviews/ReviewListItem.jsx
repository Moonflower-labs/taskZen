/* eslint-disable react/prop-types */
// import { taskProps } from "../../utils/propTypes";
import { Link, useFetcher, useRouteLoaderData } from "react-router-dom";
import { ImBin } from "react-icons/im";
import { IoIosWarning } from "react-icons/io";
import { FcApproval } from "react-icons/fc";
import { GrInProgress, GrEdit } from "react-icons/gr";

import getCookie from "../../utils/cookie";

const ReviewListItem = ({ review }) => {
  const { isAdmin } = useRouteLoaderData("root") || false;
  const fetcher = useFetcher();
  const csrfToken = getCookie("csrftoken") || "";

  return (
    <tr
      className={`table-${
        review.status === "Approved"
          ? "success"
          : review.status === "Rejected"
          ? "danger"
          : ""
      }`}
    >
      <th scope="row">{review.id}</th>
      <td>
        <Link to={`/reviews/${review.id}`} className="task">
          {review.comments.length > 15
            ? `${review.comments.substring(0, 100)}...`
            : review.comments}
        </Link>
      </td>
      <td>
        <div className="d-flex text-nowrap justify-content-center">
          {review?.review_date}
        </div>
      </td>
      <td>
        <Link to={`/tasks/${review.task.id}`} className="task">
          {review.task.title.length > 15
            ? `${review.task.title.substring(0, 100)}...`
            : review.task.title}
        </Link>
      </td>
      <td>
        <div className="d-flex text-nowrap justify-content-center">
          {review.status === "Rejected" ? (
            <IoIosWarning className="text-danger" size={24} />
          ) : review.status === "Approved" ? (
            <FcApproval size={24} />
          ) : (
            <GrInProgress className="text-primary" size={24} />
          )}
        </div>
      </td>

      <td>
        {isAdmin && (
          <div className="d-flex justify-content-around gap-3 gap-md-0">
            <Link
              to={`${review.id}/edit`}
              className="btn btn-sm btn-success shadow"
            >
              <GrEdit title="Edit" className="text-primary" />
            </Link>
            <fetcher.Form method="delete">
              <input
                type="hidden"
                name="csrfmiddlewaretoken"
                value={csrfToken}
              />
              <button
                className="btn btn-sm btn-outline-danger shadow"
                type="submit"
                name="id"
                value={review.id}
              >
                <ImBin title="Delete" />
              </button>
            </fetcher.Form>
          </div>
        )}
      </td>
    </tr>
  );
};

export default ReviewListItem;
