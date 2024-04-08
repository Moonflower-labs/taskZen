/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { useLocation, useFetcher, useSubmit } from "react-router-dom";

const TaskFilter = () => {
  const fetcher = useFetcher();
  let submit = useSubmit();
  const location = useLocation();
  const selectRef = useRef(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const priorityFromUrl = searchParams.get("priority");
    if (priorityFromUrl) {
      selectRef.current.value = priorityFromUrl;
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
          name="priority"
          id="priority"
          defaultValue={"all"}
          ref={selectRef}
        >
          <option value={"all"}>All</option>
          <option value={"low"}>Low</option>
          <option value={"medium"}>Medium</option>
          <option value={"high"}>High</option>
        </select>
        <label htmlFor="priority" className="mb-3">
          Priority
        </label>
      </div>
    </fetcher.Form>
  );
};

export default TaskFilter;
