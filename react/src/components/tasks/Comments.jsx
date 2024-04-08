/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { useFetcher, useRouteLoaderData } from "react-router-dom";
import { ImBin } from "react-icons/im";
import getCookie from "../../utils/cookie";

const Comments = ({ comments, taskId }) => {
  const { isAdmin, user } = useRouteLoaderData("root") || {};
  const fetcher = useFetcher();
  const csrfToken = getCookie("csrfToken") || "";
  let commentFormRef = useRef(null);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.message) {
      commentFormRef.current?.reset(); // Reset the form
    }
  }, [fetcher.state, fetcher.data]);
  return (
    <div>
      {comments && comments.length ? (
        comments.map((comment) => (
          <div key={comment.id}>
            <p>{comment.text}</p>
            <div className="d-flex justify-content-between">
              <p>
                On {comment.date} by {comment.user}
              </p>
              {(isAdmin || comment.user === user.username) && (
                <fetcher.Form method="delete" className="text-center">
                  <input
                    type="hidden"
                    name="csrfmiddlewaretoken"
                    value={csrfToken}
                  />
                  <input
                    type="hidden"
                    name="objectToDelete"
                    value={"comment"}
                  />
                  <button
                    className="btn btn-sm btn-outline-danger rounded-4 shadow mx-auto"
                    type="submit"
                    name="id"
                    value={comment.id}
                  >
                    <ImBin />
                  </button>
                </fetcher.Form>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No comments to display.</p>
      )}
      <fetcher.Form method="post" ref={commentFormRef}>
        <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
        <input type="hidden" name="objectToCreate" value={"comment"} />
        <textarea
          className="form-control mb-3"
          name="text"
          id="text"
          cols="30"
          rows="5"
        ></textarea>
        {fetcher.data?.error && (
          <div className="text-danger text-center my-3">
            {fetcher.data.error}
          </div>
        )}
        <button
          className="btn btn-outline-primary mb-3 shadow mx-auto"
          type="submit"
          name="id"
          value={taskId}
        >
          Add comment
        </button>
      </fetcher.Form>
    </div>
  );
};

export default Comments;
