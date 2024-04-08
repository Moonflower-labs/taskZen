/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const MissedTask = ({ data }) => {
  return (
    <div className="col-md-5 mb-3 mb-md-0 text-center m-auto">
      <h4 className="mb-3">Missed deadlines</h4>
      <ul className="list-group">
        {data?.missed_deadlines.length ? (
          data.missed_deadlines.map((task) => (
            <li
              key={task.id}
              className="list-group-item list-group-item-action"
            >
              <Link
                className="icon-link text-decoration-none"
                to={`/tasks/${task.id}`}
              >
                {task?.title}
              </Link>
            </li>
          ))
        ) : (
          <p className="my-auto">No tasks with missed deadlines 😀.</p>
        )}
      </ul>
    </div>
  );
};

export default MissedTask;
