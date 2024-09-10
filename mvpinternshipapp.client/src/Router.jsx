import App from './App';
import { createBrowserRouter } from "react-router-dom";
import { ProductPage } from './pages/ProductPage';
import { StorePage } from './pages/StorePage';

import routes from './Routes'
import { CustomerPage } from './pages/CustomerPage';
import { SalePage } from './pages/SalePage';
import { HomePage } from './pages/HomePage';

const router = createBrowserRouter([
    { 
        path: "/",
        element: <App />,
        children: [
            {
                path: routes.HOME,
                element: <HomePage/>
            },
            {
                path: routes.PRODUCTS,
                element: <ProductPage />
            },
            {
                path: routes.STORES,
                element: <StorePage />
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
