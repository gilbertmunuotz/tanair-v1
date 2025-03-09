import Login from "./pages/login";
import UserPage from "./pages/normalusersPage";
import AdminPage from "./pages/adminPage";
import AdminUsers from "./pages/users";
import NotFound from "./components/Notfound";
import LandingPage from "./pages/LandingPage";
import "react-toastify/dist/ReactToastify.css";
import { Slide, ToastContainer } from "react-toastify";
import { PrivateRoute } from "./components/PrivateRoute";
import { RoleBasedRoute } from "./components/RoleBasedRoute";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <Login /> },
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <RoleBasedRoute allowedRole="admin">
          <AdminPage />
        </RoleBasedRoute>
      </PrivateRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/admin/users",
    element: (
      <PrivateRoute>
        <RoleBasedRoute allowedRole="admin">
          <AdminUsers />
        </RoleBasedRoute>
      </PrivateRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/user",
    element: (
      <PrivateRoute>
        <RoleBasedRoute allowedRole="user">
          <UserPage />
        </RoleBasedRoute>
      </PrivateRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "*", // This is the catch-all wildcard route for unmatched paths
    element: <NotFound />,
  },
]);

export default function App() {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
      <RouterProvider router={router} />
    </>
  );
}