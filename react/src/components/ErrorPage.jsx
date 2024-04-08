import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);
  return (
    <div className="min-vh-100 w-100 d-flex justify-content-center align-items-center">
      <div className="text-center">
        <h1 className="mb-3">Oops!</h1>
        <h5 className="mb-3">Sorry, an error has ocurred.</h5>
        <p className="text-danger">
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
