/* eslint-disable react-refresh/only-export-components */
import {
  useLoaderData,
  Link,
  useFetcher,
  redirect,
  useRouteLoaderData,
} from "react-router-dom";
import { ImBin } from "react-icons/im";
import { GrEdit } from "react-icons/gr";
import fetchAPI from "../../api/fetch";
import getCookie from "../../utils/cookie";
import appendAlert from "../../utils/alert";

export async function loader({ params }) {
  const data = await fetchAPI(`api/team/${params.teamId}`);

  return data ? data : null;
}

export async function action({ request }) {
  switch (request.method) {
    case "DELETE": {
      const formData = await request.formData();
      const teamId = formData.get("id");
      if (window.confirm("Are you sure you want to delete this team?")) {
        const response = await fetchAPI(`api/team/${teamId}`, {
          method: "delete",
        });
        if (response.error) {
          appendAlert(response.error, "warning");
          return response.error;
        }
        appendAlert(response?.message, "success");

        return redirect("/teams");
      } else {
        return null;
      }
    }
    default: {
      throw new Response("", { status: 405 });
    }
  }
}
const TeamtDetail = () => {
  const { team } = useLoaderData() || {};
  const { user, isAdmin } = useRouteLoaderData("root") || {};
  const fetcher = useFetcher();
  const csrfToken = getCookie("csrftoken") || "";
  const isTeamManager =
    team.managers.some((manager) => manager.username === user.username) ||
    false;
  return (
    <div className="container">
      {team ? (
        <div className="row">
          <div className="d-flex justify-content-between align-items-center">
            <h1>{team.name}</h1>
            {isAdmin && isTeamManager && (
              <div className="d-flex gap-3">
                <Link to={"edit"} className="btn btn-success shadow">
                  <GrEdit title="Edit" className="text-primary" />
                </Link>
                <fetcher.Form method="delete">
                  <input
                    type="hidden"
                    name="csrfmiddlewaretoken"
                    value={csrfToken}
                  />
                  <button
                    className="btn btn-outline-danger shadow"
                    type="submit"
                    name="id"
                    value={team.id}
                  >
                    <ImBin />
                  </button>
                </fetcher.Form>
              </div>
            )}
          </div>

          <div className="col">
            <h5>
              <span className="badge text-bg-primary">
                Members {team?.members.length}
              </span>
            </h5>
            <ul className="list-group mb-3">
              {team?.members.length &&
                team.members.map((member) => (
                  <li key={member.id} className="list-group-item ">
                    <div className="d-flex justify-content-between">
                      <span>{member.username}</span>
                      <span>{member.roles}</span>
                    </div>
                  </li>
                ))}
            </ul>
            <h5>
              <span className="badge text-bg-primary">
                Managers {team?.managers?.length}
              </span>
            </h5>
            <ul className="list-group">
              {team?.managers.length &&
                team.managers.map((manager) => (
                  <li key={manager.id} className="list-group-item ">
                    <div className="d-flex justify-content-between">
                      <span>{manager.username}</span>
                      <div className="d-flex gap-2">
                        {manager.roles.map((role, index) => (
                          <span key={role}>
                            {role}
                            {index < manager.roles.length - 1 && (
                              <span> /</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      ) : (
        <h4 className="text-center">No team found with the requested id.</h4>
      )}
    </div>
  );
};

export default TeamtDetail;
