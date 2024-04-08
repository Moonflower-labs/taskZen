/* eslint-disable react/prop-types */
import { useRouteLoaderData } from "react-router-dom";
import { Link, Form } from "react-router-dom";
import { FcApproval } from "react-icons/fc";
import { GrInProgress } from "react-icons/gr";
import { IoIosWarning } from "react-icons/io";
import { ImBin } from "react-icons/im";

const ReviewItem = ({ review }) => {
  const { isAdmin } = useRouteLoaderData("root") || false;
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p>
          Status
          <span className="ms-3">
            {review.status === "Pending" ? (
              <GrInProgress className="text-primary" size={24} />
            ) : review.status === "Approved" ? (
              <FcApproval size={24} />
            ) : (
              <IoIosWarning className="text-danger" size={24} />
            )}
          </span>
        </p>
        {isAdmin && (
          <div className="d-flex gap-2">
            <Link
              to={`/reviews/${review.id}/edit`}
              className="btn btn-success border border-secondary shadow"
            >
              Edit
            </Link>
            <Form method="delete">
              <button
                name="id"
                value={review.id}
                className="btn btn-danger border border-secondary shadow"
              >
                <ImBin />
              </button>
            </Form>
          </div>
        )}
      </div>
      <div className="d-flex flex-column justify-content-between">
        <h5>Task reviewed</h5>
        <hr className="border border-2 border-primary mb-4" />
        <Link to={`/tasks/${review.task.id}`} className="task">
          <p className="description p-2 mb-4">{review.task.title}</p>
        </Link>
        <div className="d-flex justify-content-between p-2 mb-4">
          <p>Assignee</p>
          <span className="fw-bold">{review.task.assigned_to}</span>
        </div>
      </div>
      <div>
        <h4>Comments</h4>
        <hr className="border border-2 border-primary mb-4" />
        <p className="description p-2 mb-4 ">{review.comments}</p>
      </div>
    </>
  );
};

export default ReviewItem;
