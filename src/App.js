import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Webhooks from "./components/Webhooks/Webhooks";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/webhooks",
    element: <Webhooks />,
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />

      <ToastContainer />
    </div>
  );
}

export default App;
