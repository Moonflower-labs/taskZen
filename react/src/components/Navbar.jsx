import { NavLink, useRouteLoaderData, useFetcher } from "react-router-dom";

const Navbar = () => {
  const { user, isAdmin } = useRouteLoaderData("root") || {};
  return (
    <nav className="sticky-top bg-light mx-auto">
      <ul className="nav nav-underline justify-content-center mb-4">
        {user?.username ? (
          <>
            <li className="nav-item">
              <NavLink className={`nav-link`} aria-current="page" to={"/"}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to={"dashboard"}>
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to={"teams"}>
                Teams
              </NavLink>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link" to={"projects"}>
                  Projects
                </NavLink>
              </li>
            )}
            <li className="nav-item">
              <NavLink className="nav-link position-relative" to={"tasks"}>
                Tasks
                {user?.pending_assignments &&
                  user.pending_assignments.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {user.pending_assignments.length}
                      <span className="visually-hidden">
                        pending assignments
                      </span>
                    </span>
                  )}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link position-relative" to={"reviews"}>
                Reviews
                {isAdmin && user?.pending_reviews?.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {user.pending_reviews.length}
                    <span className="visually-hidden">pending reviews</span>
                  </span>
                )}
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <NavLink className="nav-link" to={"login"}>
                Log In
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to={"register"}>
                Register
              </NavLink>
            </li>
          </>
        )}
        <li className="nav-item d-flex mb-2 mb-md-0">
          <AuthStatus />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

export const AuthStatus = () => {
  const { user } = useRouteLoaderData("root") || {};
  let fetcher = useFetcher();
  let isLoggingOut = fetcher.formData != null;

  return (
    <div className="d-flex align-items-center my-auto">
      {!user?.username ? (
        <div className="me-4">You are not logged in.</div>
      ) : (
        <>
          <p className="m-auto">Welcome {user.username}!</p>
          <fetcher.Form method="post" action="/logout">
            <button
              className="btn btn-sm btn-outline-primary m-auto ms-4"
              type="submit"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <div className="d-flex align-items-center gap-3">
                  <div>Logging out</div>
                  <div
                    className="spinner-border spinner-border-sm text-primary"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                "Log Out"
              )}
            </button>
          </fetcher.Form>
        </>
      )}
    </div>
  );
};
