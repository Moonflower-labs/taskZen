/* eslint-disable react-refresh/only-export-components */
import {
  Form,
  Link,
  redirect,
  useLoaderData,
  useNavigation,
  useActionData,
} from "react-router-dom";
import authProvider from "../../utils/authProvider";
import { getTokentValue } from "../../utils/cookie";

export async function loader() {
  return await getTokentValue();
}

export const action = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const email = formData.get("email");
  const password1 = formData.get("password");
  const password2 = formData.get("confirmation");

  //   Validate user input before submitting to the server
  if (!username) return { error: "You must enter a valid username" };
  if (!email) return { error: "You must enter a valid email" };
  if (!password1) return { error: "You must enter a password" };
  if (!password2) return { error: "You must confirm your password" };
  if (password1 !== password2) return { error: "The passwords must match" };

  const newUser = await authProvider.register(formData);
  if (!newUser) return { error: "Invalid register attempt" };
  // Log in the new registered user
  await authProvider.login(formData);

  return redirect("/dashboard");
};

const Register = () => {
  const csrfToken = useLoaderData();

  let navigation = useNavigation();
  let isLogginIn = navigation.formData?.get("username") != null;
  let actionData = useActionData();
  return (
    <div className="row align-items-center">
      <div className="col-lg-6 mx-md-auto">
        <h2 className="text-center my-3">Register</h2>
        <Form method="post">
          <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
          <div className="form-floating mb-3">
            <input
              autoFocus
              className="form-control mb-4"
              type="text"
              name="username"
              placeholder="Username"
            />
            <label htmlFor="username">Username</label>
          </div>
          <div className="form-floating mb-3">
            <input
              className="form-control mb-4"
              type="email"
              name="email"
              placeholder="Email Address"
            />
            <label htmlFor="email">Email address</label>
          </div>
          <div className="form-floating mb-3">
            <input
              className="form-control mb-4"
              type="password"
              name="password"
              placeholder="Password"
            />
            <label htmlFor="confirmation">Password</label>
          </div>
          <div className="form-floating mb-3">
            <input
              className="form-control mb-4"
              type="password"
              name="confirmation"
              placeholder="Confirm Password"
            />
            <label htmlFor="confirmation">Confirm password</label>
          </div>
          <div className="form-floating mb-3">
            <input
              className="form-control mb-4"
              type="text"
              name="company"
              placeholder="Company name"
            />
            <label htmlFor="company">Company name</label>
          </div>
          <div className="form-floating mb-3">
            <select name="role" id="role" className="form-select mb-3">
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
            <label htmlFor="role">Role</label>
          </div>

          {actionData && actionData.error ? (
            <p className="text-center text-danger">{actionData.error}</p>
          ) : null}
          <div className="w-100 text-center">
            <button className="btn btn-lg btn-primary mb-4" type="submit">
              {isLogginIn ? (
                <div className="d-flex align-items-center gap-3">
                  <div>Registering </div>
                  <div
                    className="spinner-border spinner-border-sm text-white"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                "Register"
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

export default Register;
