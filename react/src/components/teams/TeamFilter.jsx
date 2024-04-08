/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { useLocation, useFetcher, useSubmit } from "react-router-dom";

const TeamFilter = ({ isAdmin }) => {
  const fetcher = useFetcher();
  let submit = useSubmit();
  const location = useLocation();
  const selectRef = useRef(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const teamsFromUrl = searchParams.get("teams");
    if (teamsFromUrl) {
      selectRef.current.value = teamsFromUrl;
    } else {
      selectRef.current.value = "all";
    }
  }, [location.search]);

  return (
    <fetcher.Form
      onChange={(event) => {
        submit(event.currentTarget);
      }}
      className="d-flex gap-2 align-items-center"
    >
      <div className="w-100 form-floating">
        <select
          className="form-select mb-3"
          aria-label="filter select"
          name="teams"
          id="teams"
          defaultValue={"all"}
          ref={selectRef}
        >
          <option value={"all"}>All</option>
          <option value={isAdmin ? "managed" : "myTeams"}>
            {isAdmin ? "Managed teams" : "My teams"}
          </option>
        </select>
        <label htmlFor="teams" className="mb-3">
          Filter by
        </label>
      </div>
    </fetcher.Form>
  );
};

export default TeamFilter;
