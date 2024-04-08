import { useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-vh-100 w-100 d-flex justify-content-center align-items-center">
      <div className="text-center">
        <h1 className="mb-4">Not found</h1>
        <h5 className="mb-3">
          The requested page{" "}
          <i className="fw-bold mx-2 text-primary">{location.pathname}</i>{" "}
          hasn&apos;t been found.
        </h5>
      </div>
    </div>
  );
};

export default NotFound;
