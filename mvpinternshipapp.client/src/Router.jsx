import App from './App';
import { createBrowserRouter } from "react-router-dom"
import { ProductTable } from './components/ProductTable';
import DataTable from './components/DataTable';
import routes from './Routes'

const homeContents = (
    <>
        <h1 id="tableLabel">Weather forecast</h1>
        <p>This component demonstrates fetching data from the server.</p>
    </>
)

const router = createBrowserRouter([
    { 
        path: "/",
        element: <App />,
        children: [
            {
                path: routes.HOME,
                element: homeContents
            },
            {
                path: routes.PRODUCTS,
                element: <ProductTable />
            },
            {
                path: routes.STORES,
                element: <><h1>ok</h1><DataTable url={"https://localhost:7065/api/Store"} /></>
            },
            {
                path: routes.CUSTOMERS,
                element: <><h1>oka</h1><DataTable url={"https://localhost:7065/api/Customer"} /></>
            },
            {
                path: routes.SALES,
                element: <><h1>oks</h1><DataTable url={"https://localhost:7065/api/Sale"} /></>
            }
        ]
    }
]);

export { routes };

export default router;
