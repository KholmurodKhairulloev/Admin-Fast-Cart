import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashbord from "./components/Dashboard/dashboard";
import Dashboard from "/src/pages/Dashboard/dashboard";
import Orders from "/src/pages/Orders/orders";
import Products from "/src/pages/Products/products";
import Other from "/src/pages/Other/other";
import ProductForm from "./pages/addProduct/addProduct";
import LoginPage from "./pages/logIn/logIn";
import AuthCheck from "./authCheck/authCheck";
import EditProductForm from "./pages/editProducts/editProducts";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthCheck><Dashbord /></AuthCheck>,
      children: [
        {
          path: "/",
          index: true,
          element: <Dashboard />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        {
          path: "/products",
          element: <Products />,
        },
        {
          path: "/other",
          element: <Other />,
        },
        {
          path: "/addProduct",
          element: <ProductForm />,
        },
        {
          path: "/editProduct/:id",
          element: <EditProductForm />,
        }
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    }
  ]);
  return <RouterProvider router={router} />;
}

export default App;
