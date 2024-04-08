/* eslint-disable react-refresh/only-export-components */
import { useRouteLoaderData, useLoaderData, Link } from "react-router-dom";
import StatusCard from "../components/dashboard/StatusCard";
import ProjectCard from "../components/dashboard/ProjectCard";
import UrgentTask from "../components/dashboard/UrgentTask";
import MissedTask from "../components/dashboard/MissedTask";
import Progress from "../components/Progress";
import fetchAPI from "../api/fetch";

export async function loader() {
  const data = await fetchAPI("api/dashboard");

  return data ? data : null;
}
const Dashboard = () => {
  const data = useLoaderData() || {};

  const { user, isAdmin } = useRouteLoaderData("root") || {};
  return (
    <div className="container mb-3">
      <h2 className="text-center mb-3">{user?.username}&apos;s dashboard</h2>

      <div className="row justify-content-center align-items-center mb-5">
        <StatusCard data={data} />
        {!isAdmin && (
          <div className="mb-3">
            <h4 className="text-center">Total tasks progress</h4>
            <Progress tasks={data?.tasks} />
          </div>
        )}
        <hr className="d-md-none border-3" />
        {isAdmin && <ProjectCard projects={data?.projects} />}
      </div>
      <div className="row justify-content-center align-items-center mb-3">
        <UrgentTask tasks={data?.urgent_tasks} />
        <hr className="d-md-none w-75 m-auto my-4" />
        <MissedTask data={data} />
      </div>
      <div className="row justify-content-center align-items-center">
        {!isAdmin ? (
          <div className="col">
            <h4>My teams</h4>
            <hr className="m-auto my-4" />
            {user.teams.length ? (
              user.teams.map((team) => (
                <div key={team.id}>
                  <Link to={`/teams/${team.id}`} className="task">
                    {team.name}
                  </Link>
                </div>
              ))
            ) : (
              <p>You don&apos;t belong to any teams yet.</p>
            )}
          </div>
        ) : (
          <div className="col">
            <h4>Managed teams</h4>
            <hr className="m-auto my-4" />
            <ul className="list-group list-group-flush">
              {user.managed_teams.length ? (
                user.managed_teams.map((team) => (
                  <li key={team.id} className="list-group-item">
                    <Link to={`/teams/${team.id}`} className="task">
                      {team.name}
                    </Link>
                  </li>
                ))
              ) : (
                <p>You don&apos;t manage any teams yet.</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
