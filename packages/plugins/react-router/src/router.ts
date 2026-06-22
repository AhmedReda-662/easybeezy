import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy } from "react";

const Home = lazy(() => import("../../features/home/pages/Home"));

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "*",
    element: <div>404 - Not Found</div>,
  },
];

const router = createBrowserRouter(routes);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export { router, routes };
