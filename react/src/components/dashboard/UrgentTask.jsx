/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const UrgentTask = ({ tasks }) => {
  return (
    <div className="col-md-5 mb-3 mb-md-0  text-center m-auto">
      <h4 className="mb-3">Urgent tasks</h4>
      <ul className="list-group">
        {tasks.length ? (
          tasks.map((task) => (
            <li
              key={task.id}
              className="list-group-item list-group-item-action"
            >
              <Link className="text-decoration-none" to={`/tasks/${task.id}`}>
                {task?.title}
                <span className="ms-3 text-info">{task?.due_date}</span>
              </Link>
            </li>
          ))
        ) : (
          <p>No urgent tasks yet 👍.</p>
        )}
      </ul>
    </div>
  );
};

export default UrgentTask;
