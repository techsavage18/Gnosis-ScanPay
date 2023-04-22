import "./App.css";
import Home from "./pages/Home";
import Pay from "./pages/Pay";
import PayConfirmation from "./pages/PayConfirmation";
import PaymentCode from "./pages/PaymentCode";
import Receive from "./pages/Receive";
import ReceiveCode from "./pages/ReceiveCode";
import ReceiveConfirmation from "./pages/ReceiveConfirmation";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/pay",
        element: <Pay />,
    },
    {
        path: "/payConfirmation",
        element: <PayConfirmation />,
    },
    {
        path: "/paymentCode",
        element: <PaymentCode />,
    },
    {
        path: "/receive",
        element: <Receive />,
    },
    {
        path: "/receiveCode",
        element: <ReceiveCode />,
    },
    {
        path: "/receiveConfirmation",
        element: <ReceiveConfirmation />,
    },
]);

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
