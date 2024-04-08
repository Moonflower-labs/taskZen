/* eslint-disable react-refresh/only-export-components */
import {
  Form,
  Link,
  redirect,
  useLoaderData,
  useLocation,
  useNavigation,
  useActionData,
} from "react-router-dom";
import authProvider from "../../utils/authProvider";
import { getTokentValue } from "../../utils/cookie";

export async function loader() {
  return await getTokentValue();
}

export async function action({ request }) {
  const formData = await request.formData();
  const username = formData.get("username");
  // Validate  user input
  if (!username) return { error: "You must provide a username to log in." };

  const userData = await authProvider.login(formData);
  if (!userData) return { error: "Invalid login attempt" };

  let redirectTo = formData.get("redirectTo");

  return redirect(redirectTo || "/dashboard");
}

const Login = () => {
  const csrfToken = useLoaderData() || "";

  let location = useLocation();
  let params = new URLSearchParams(location.search);
  let from = params.get("from") || "/dashboard";

  let navigation = useNavigation();
  let isLogginIn = navigation.formData?.get("username") != null;
  let actionData = useActionData();
  return (
    <div className="row align-items-center">
      <div className="col-lg-6 mx-md-auto">
        <h2 className="text-center my-3">Login</h2>
        <Form method="post">
          <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
          <input type="hidden" name="redirectTo" value={from} />
          <input
            autoFocus
            className="form-control mb-4"
            type="text"
            name="username"
            placeholder="Username"
          />
          <input
            className="form-control mb-4"
            type="password"
            name="password"
            placeholder="Password"
          />
          {actionData && actionData.error ? (
            <p className="text-center text-danger">{actionData.error}</p>
          ) : null}
          <div className="w-100 text-center">
            <button
              className="btn btn-lg btn-primary mb-4"
              type="submit"
              value="Login"
            >
              {isLogginIn ? (
                <div className="d-flex align-items-center gap-3">
                  <div>Logging in </div>
                  <div
                    className="spinner-border spinner-border-sm text-white"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </Form>
        <div className="text-center">
          <p>
            Don&apos;t have an account?{" "}
            <Link to={"register"}>Register here.</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
