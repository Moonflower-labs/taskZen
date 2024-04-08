import { teamProps } from "../../utils/propTypes";
import { Link, useFetcher, useRouteLoaderData } from "react-router-dom";
import { ImBin } from "react-icons/im";
import { GrEdit } from "react-icons/gr";
import getCookie from "../../utils/cookie";

const TeamListItem = ({ team }) => {
  const fetcher = useFetcher();
  const csrfToken = getCookie("csrftoken") || "";
  const { user, isAdmin } = useRouteLoaderData("root") || {};
  const isTeamManager =
    team.managers.some((manager) => manager.username === user.username) ||
    false;

  return (
    <tr>
      <th scope="row">{team.id}</th>
      <td>
        <Link to={`/teams/${team.id}`} className="team">
          {team.name}
        </Link>
      </td>
      <td>
        <span className="badge text-bg-primary">{team.members.length}</span>
      </td>

      {isAdmin && isTeamManager ? (
        <td>
          <div className="d-flex justify-content-around gap-3 gap-md-0">
            <Link to={`${team.id}/edit`} className="btn btn-success shadow">
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
        </td>
      ) : (
        <td>
          <div>You don&apos;t manage this team.</div>
        </td>
      )}
    </tr>
  );
};

export default TeamListItem;
TeamListItem.propTypes = teamProps;
