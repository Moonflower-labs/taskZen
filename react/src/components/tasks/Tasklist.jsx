import TaskListItem from "./TaskListItem";
import { taskProps } from "../../utils/propTypes";

const Tasklist = ({ tasks }) => {
  return (
    <>
      {tasks && tasks.length ? (
        <div className="table-responsive">
          <table className="table  text-center align-middle">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Title</th>
                <th scope="col">Due by</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <TaskListItem key={task.id} task={task} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">No tasks to display.</p>
      )}
    </>
  );
};

export default Tasklist;

Tasklist.propTypes = taskProps;
