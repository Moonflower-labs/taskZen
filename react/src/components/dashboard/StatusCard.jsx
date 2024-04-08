/* eslint-disable react/prop-types */

const StatusCard = ({ data }) => {
  return (
    <>
      <h5 className="mb-3 my-auto text-center">STATS</h5>
      <div className="border bg-body-secondary rounded-2 p-1 d-flex gap-1 flex-column flex-md-row justify-content-around align-items-center shadow shadow-sm mb-4">
        <h3 className="w-100 m-auto">
          <span className="badge text-bg-light py-2 w-100 d-flex justify-content-between">
            <div>Total tasks</div> <div>{data?.all_tasks_count}</div>
          </span>
        </h3>
        <h3 className="w-100 m-auto">
          <span
            className={`badge text-bg-light py-2 w-100 d-flex justify-content-between`}
          >
            <div>Completed tasks</div>
            <div>{data?.completed_tasks_count}</div>
          </span>
        </h3>
        <h3 className="w-100 m-auto">
          <span className="badge text-bg-light py-2 w-100 d-flex justify-content-between">
            <div>Pending tasks</div> <div>{data?.pending_tasks_count}</div>
          </span>
        </h3>
        <h3 className="w-100 m-auto">
          <span
            className={`badge text-bg-${
              data?.missed_deadlines_count === 0 ? "light" : "danger"
            } py-2 w-100 d-flex justify-content-between`}
          >
            <div>Missed tasks</div> <div>{data?.missed_deadlines_count}</div>
          </span>
        </h3>
      </div>
    </>
  );
};

export default StatusCard;
