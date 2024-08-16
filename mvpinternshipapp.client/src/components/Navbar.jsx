import { Link } from 'react-router-dom';
import "./Navbar.css";
import routes from '../Routes'

export default function Navbar() {
    return (
        <div className="navbar">
            <Link to={routes.PRODUCTS}><a>Products</a></Link>
            <Link to={routes.CUSTOMERS}><a>Customers</a></Link>
            <Link to={routes.STORES}><a>Stores</a></Link>
            <Link to={routes.SALES}><a>Sales</a></Link>
        </div>
    );
}   