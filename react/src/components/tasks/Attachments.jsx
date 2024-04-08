/* eslint-disable react/prop-types */
import { FaDownload } from "react-icons/fa";
import { ImBin } from "react-icons/im";
import { getFileIcon, getFileExtension } from "../../utils/helpers";
import { useFetcher } from "react-router-dom";
import getCookie from "../../utils/cookie";

const Attachments = ({ attachments }) => {
  const fetcher = useFetcher();
  const csrfToken = getCookie("csrftoken") || "";
  return (
    <div className="col d-flex justify-content-center gap-3 mx-auto mb-4 overflow-x-auto">
      {attachments && attachments.length ? (
        attachments.map((attachment, index) => (
          <div key={`attachment-${attachment.url}`} className="d-flex gap-2">
            {attachment?.content_type?.startsWith("image/") ? ( // Check if the attachment is an image
              <div className="d-flex gap-2 align-items-center">
                <img
                  src={`http://localhost:8000${attachment.url}`}
                  alt="Attachment"
                  style={{ width: 50 }}
                />
                <a
                  href={`http://localhost:8000${attachment.url}`}
                  target="_blank"
                  download
                >
                  <FaDownload />
                </a>

                <fetcher.Form method="delete" className="text-center">
                  <input
                    type="hidden"
                    name="csrfmiddlewaretoken"
                    value={csrfToken}
                  />
                  <input
                    type="hidden"
                    name="objectToDelete"
                    value={"attachment"}
                  />
                  <button
                    className="btn btn-sm btn-outline-danger rounded-4 shadow mx-auto"
                    type="submit"
                    name="id"
                    value={attachment.id}
                  >
                    <ImBin />
                  </button>
                </fetcher.Form>

                {index !== attachments.length - 1 && (
                  <hr className="border border-secondary mb-4 h-100" />
                )}
              </div>
            ) : (
              <div className="d-flex gap-2 align-items-center">
                <div className="text-primary">
                  {getFileIcon(attachment.url)}
                  {getFileExtension(attachment.url)}
                </div>

                <a
                  href={`http://localhost:8000${attachment.url}`}
                  target="_blank"
                >
                  <FaDownload />
                </a>

                <fetcher.Form method="delete" className="text-center">
                  <input
                    type="hidden"
                    name="csrfmiddlewaretoken"
                    value={csrfToken}
                  />
                  <input
                    type="hidden"
                    name="objectToDelete"
                    value={"attachment"}
                  />
                  <button
                    className="btn btn-sm btn-outline-danger rounded-4 shadow mx-auto"
                    type="submit"
                    name="id"
                    value={attachment.id}
                  >
                    <ImBin />
                  </button>
                </fetcher.Form>

                {index !== attachments.length - 1 && (
                  <hr className="border border-secondary mb-4 h-100" />
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No attachments provided.</p>
      )}
    </div>
  );
};

export default Attachments;
