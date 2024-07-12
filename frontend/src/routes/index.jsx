import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import NotFound from "../components/NotFound";
import PrivateRoute from "../helpers/privateRoute/PrivateRoute";
import ManageUsers from "../pages/dashboard/manageUsers/ManageUsers";
import ManageItems from "../pages/dashboard/manageItems/ManageItems";

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/users",
        element: <ManageUsers />,
      },
      {
        path: "/items",
        element: <ManageItems />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
