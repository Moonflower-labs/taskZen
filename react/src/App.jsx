import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import Root from "./components/layouts/RootLayout";
import Login from "./routes/auth/login";
import Register from "./routes/auth/register";
import Dashboard from "./routes/dashboard";
import Teams from "./routes/teams";
import TeamtDetail from "./routes/teams/detail";
import EditTeam from "./routes/teams/edit";
import TaskDetail from "./routes/tasks/detail";
import EditTask from "./routes/tasks/edit";
import Tasks from "./routes/tasks/index";
import Reviews from "./routes/reviews";
import ReviewtDetail from "./routes/reviews/detail";
import EditReview from "./routes/reviews/edit";
import Home from "./components/Home";
import Projects from "./routes/projects/index";
import authProvider from "./utils/authProvider";
import ErrorPage from "./components/ErrorPage";
import NotFound from "./components/NotFound";
import ProjectDetail from "./routes/projects/detail";
import EditProject from "./routes/projects/edit";
import protectedRouteLoader from "./utils/protectedRouteLoader";
import { loader as teamsLoader } from "./routes/teams/index";
import { action as createTeamAction } from "./routes/teams/create";
import { action as teamsAction } from "./routes/teams";
import { action as editTeamAction } from "./routes/teams/edit";
import { loader as editTeamLoader } from "./routes/teams/edit";
import { loader as teamDetailLoader } from "./routes/teams/detail";
import { action as teamDetailAction } from "./routes/teams/detail";
import { action as loginAction } from "./routes/auth/login";
import { loader as loginLoader } from "./routes/auth/login";
import { action as registerAction } from "./routes/auth/register";
import { loader as registerLoader } from "./routes/auth/register";
import { loader as taskDetailLoader } from "./routes/tasks/detail";
import { action as taskDetailAction } from "./routes/tasks/detail";
import { loader as tasksLoader, action as tasksAction } from "./routes/tasks";
import { loader as projectsLoader } from "./routes/projects/index";
import { action as projectsAction } from "./routes/projects/index";
import { action as projectDetailAction } from "./routes/projects/detail";
import { action as projectCreateAction } from "./routes/projects/create";
import { loader as projectEditLoader } from "./routes/projects/edit";
import { action as projectEditAction } from "./routes/projects/edit";
import { loader as reviewLoader } from "./routes/reviews";
import { action as reviewAction } from "./routes/reviews";
import { loader as reviewDetailLoader } from "./routes/reviews/detail";
import { action as reviewDetailAction } from "./routes/reviews/detail";
import { loader as editReviewLoader } from "./routes/reviews/edit";
import { action as editReviewAction } from "./routes/reviews/edit";
import { loader as dashboardLoader } from "./routes/dashboard";
import { action as createTaskAction } from "./routes/tasks/create";
import { loader as taskEditLoader } from "./routes/tasks/edit";
import { action as taskEditAction } from "./routes/tasks/edit";
import { loader as projectDetailLoader } from "./routes/projects/detail";
import DashboardSkeleton from "./components/skeletons/DashboardSkeleton";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./styles/App.css";
import "./styles/app.scss";
import fetchAPI from "./api/fetch";

const router = createBrowserRouter(
  [
    {
      path: "/",
      id: "root",
      element: <Root />,
      hydrateFallbackElement: <DashboardSkeleton />,
      errorElement: <ErrorPage />,

      loader: async () => {
        const user = await fetchAPI("api/user/profile");
        const isAdmin =
          user?.roles?.includes("Admin") || user?.roles?.includes("Manager");
        if (user) {
          return { user: user, isAdmin: isAdmin };
        }
        return null;
      },
      children: [
        {
          index: true,
          element: <Home />,
          id: "home",
        },
        {
          // # Protected routes
          loader: protectedRouteLoader,
          errorElement: <ErrorPage />,
          children: [
            {
              path: "dashboard",
              loader: dashboardLoader,
              element: <Dashboard />,
            },
            {
              path: "teams",
              children: [
                {
                  index: true,
                  element: <Teams />,
                  loader: teamsLoader,
                  action: teamsAction,
                },
                {
                  path: ":teamId",
                  element: <TeamtDetail />,
                  loader: teamDetailLoader,
                  action: teamDetailAction,
                },
                {
                  path: ":teamId/edit",
                  element: <EditTeam />,
                  loader: editTeamLoader,
                  action: editTeamAction,
                },
                {
                  path: "create",
                  action: createTeamAction,
                },
              ],
            },
            {
              path: "reviews",
              children: [
                {
                  index: true,
                  element: <Reviews />,
                  loader: reviewLoader,
                  action: reviewAction,
                },
                {
                  path: ":reviewId",
                  element: <ReviewtDetail />,
                  loader: reviewDetailLoader,
                  action: reviewDetailAction,
                },
                {
                  path: ":reviewId/edit",
                  element: <EditReview />,
                  loader: editReviewLoader,
                  action: editReviewAction,
                },
              ],
            },
            {
              path: "projects",
              children: [
                {
                  index: true,
                  element: <Projects />,
                  loader: projectsLoader,
                  action: projectsAction,
                },
                {
                  path: ":projectId",
                  element: <ProjectDetail />,
                  loader: projectDetailLoader,
                  action: projectDetailAction,
                },
                {
                  path: ":projectId/edit",
                  element: <EditProject />,
                  loader: projectEditLoader,
                  action: projectEditAction,
                },
                {
                  path: "create",
                  action: projectCreateAction,
                },
              ],
            },
            {
              path: "tasks",
              id: "tasks",
              errorElement: <ErrorPage />,
              children: [
                {
                  index: true,
                  element: <Tasks />,
                  loader: tasksLoader,
                  action: tasksAction,
                },
                {
                  path: ":taskId",
                  id: "taskId",
                  element: <TaskDetail />,
                  loader: taskDetailLoader,
                  action: taskDetailAction,
                },
                {
                  path: ":taskId/edit",
                  element: <EditTask />,
                  loader: taskEditLoader,
                  action: taskEditAction,
                },
                {
                  path: "create",
                  action: createTaskAction,
                },
              ],
            },
          ],
        },
        {
          path: "login",
          element: <Login />,
          action: loginAction,
          loader: loginLoader,
        },
        {
          path: "register",
          element: <Register />,
          action: registerAction,
          loader: registerLoader,
        },

        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
    {
      path: "logout",
      action: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Fake delay
        await authProvider.logout();
        return redirect("/");
      },
    },
  ],
  {
    future: {
      v7_partialHydration: true,
    },
    hydrationData: {
      // root: "ROOT DATA",
      dashboard: "Dashboard data",
    },
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
