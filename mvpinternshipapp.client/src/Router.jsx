import App from './App';
import { createBrowserRouter } from "react-router-dom";
import { ProductPage } from './pages/ProductPage';
import { StorePage } from './pages/StorePage';

import routes from './Routes'
import { CustomerPage } from './pages/CustomerPage';
import { SalePage } from './pages/SalePage';

const router = createBrowserRouter([
    { 
        path: "/",
        element: <App />,
        children: [
            {
                path: routes.HOME,
                element: <a>World</a>
            },
            {
                path: routes.PRODUCTS,
                element: <ProductPage />
            },
            {
                path: routes.STORES,
                element: <StorePage url={"https://localhost:7065/api/Store"} />
            },
            {
                path: routes.CUSTOMERS,
                element: <CustomerPage />
            },
            {
                path: routes.SALES,
                element: <SalePage />
            }
        ]
    }
]);

export { routes };

export default router;
