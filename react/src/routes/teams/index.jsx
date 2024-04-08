/* eslint-disable react-refresh/only-export-components */
import { useLoaderData, useRouteLoaderData } from "react-router-dom";
import TeamListItem from "../../components/teams/TeamListItem";
import CreateTeam from "../../components/teams/CreateTeam";
import fetchAPI from "../../api/fetch";
import appendAlert from "../../utils/alert";
import TeamFilter from "../../components/teams/TeamFilter";
import Pagination from "../../components/Pagination";

export async function loader({ request }) {
  const url = new URL(request.url);
  // * ADD PAGES
  const page = url.searchParams.get("page") || 1;
  const teamsFilter = url.searchParams.get("teams") || "all";
  const pageParam = page ? `&page=${page}` : "";
  const data = await fetchAPI(`api/team/list?teams=${teamsFilter}${pageParam}`);

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

        return response ? response.message : null;
      } else {
        return null;
      }
    }
    default: {
      throw new Response("", { status: 405 });
    }
  }
}

const Teams = () => {
  const { teams, employees, totalPages } = useLoaderData() || {};
  const { isAdmin } = useRouteLoaderData("root") || false;

  return (
    <div className="container overflow-x-auto">
      <div className="d-flex  justify-content-between align-items-center mb-4 p-2">
        <h1 className="">Teams</h1>
        {isAdmin && (
          <button
            className="btn btn-primary"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#createTaskModal"
          >
            Add a new team
          </button>
        )}
      </div>
      <TeamFilter isAdmin={isAdmin} />
      <hr className="border border-2 border-primary mb-4" />
      {/*   Modal   */}
      <CreateTeam employees={employees} />
      {teams && teams.length ? (
        <>
          <table className="table table-hover table-bordered text-center align-middle">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Members</th>
                {isAdmin && <th scope="col">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <TeamListItem key={team.id} team={team} />
              ))}
            </tbody>
          </table>
          <Pagination totalPages={totalPages} linkTo={"teams"} />
        </>
      ) : (
        <h4 className="text-center mt-5">No teams to display.</h4>
      )}
    </div>
  );
};

export default Teams;
