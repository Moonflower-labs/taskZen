import { useRouteLoaderData, Link } from "react-router-dom";

const Home = () => {
  const user = useRouteLoaderData("root");
  const staticPrefix = import.meta.env.PROD ? "/static" : "";

  const tasksImgUrl = `${staticPrefix}/tasks.jpg`;
  const taskImgUrl = `${staticPrefix}/task.jpg`;
  const projectImgUrl = `${staticPrefix}/project.jpg`;
  const dashImgUrl = `${staticPrefix}/dash.jpg`;
  const teamImgUrl = `${staticPrefix}/team.jpg`;
  const yingYangImgUrl = `${staticPrefix}/ying-yang.png`;
  return (
    <div className="container">
      <div className="text-center home-icon p-2">
        <img
          src={yingYangImgUrl}
          width={200}
          alt="task image"
          className="img-fluid mx-auto mb-3 logo"
        />
        <h4 className="text-center p-2">
          Welcome to Task Zen {user ? user.username : ""}!
        </h4>
        <img
          src={tasksImgUrl}
          width={600}
          alt="task image"
          className="img-fluid mx-auto"
        />
      </div>
      <div className="text-center p-2">
        <h5>An easy place to manage your organization.</h5>
        <h6>
          Intuitive UI super easy to use. Register with your company name and
          role. Take a look at some of the features
        </h6>
      </div>
      <div className="row mb-4">
        <div className="col-12 mb-3 d-flex align-items-center flex-column flex-md-row">
          <div className="order-md-2 mb-3 mx-auto">
            <h5 className="text-center">Teams</h5>
            <hr className="border-2 text-primary" />
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                As an admin you can create teams within your organization to
                group employees.
              </li>
            </ul>
          </div>
          <img
            src={teamImgUrl}
            width={300}
            alt="task image"
            className="order-md-1 img-fluid mx-auto"
          />
        </div>
        <div className="col-12 mb-3 d-flex align-items-center flex-column flex-md-row">
          <div className="mb-3 mx-auto">
            <h5 className="text-center">Tasks</h5>
            <hr className="border-2 text-primary" />
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                Create, edit and delete tasks.
              </li>
              <li className="list-group-item">Set deadlines.</li>
              <li className="list-group-item">Assign to employyes.</li>
            </ul>
          </div>
          <img
            src={taskImgUrl}
            width={300}
            alt="task image"
            className="img-fluid mx-auto"
          />
        </div>
        <div className="col-12 mb-3 d-flex align-items-center flex-column flex-md-row">
          <div className="order-md-2 mb-3 mx-auto">
            <h5 className="text-center">Projects</h5>
            <hr className="border-2 text-primary" />
            <p>For complex tasks, create a project and add tasks.</p>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                Create, edit, and delete projects.
              </li>
              <li className="list-group-item">View progress.</li>
              <li className="list-group-item">Assign to employees.</li>
            </ul>
          </div>
          <img
            src={projectImgUrl}
            width={300}
            alt="task image"
            className="img-fluid mx-auto order-md-1"
          />
        </div>

        <div className="col-12 mb-3 d-flex align-items-center flex-column flex-md-row">
          <div className="mb-3 mx-auto">
            <h5 className="text-center">Dashboard</h5>
            <hr className="border-2 text-primary" />
            <p>
              Visit your <Link to={"dashboard"}>dashboard</Link> to see an
              overview and approaching deadlines.
            </p>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">View progress</li>
              <li className="list-group-item">Assign to employyes.</li>
            </ul>
          </div>
          <img
            src={dashImgUrl}
            width={300}
            alt="task image"
            className="img-fluid mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
