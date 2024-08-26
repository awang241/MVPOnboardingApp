import { Link, useLocation } from 'react-router-dom';
import "./Navbar.css";
import { Menu, MenuItem } from 'semantic-ui-react'
import routes from '../Routes'

export default function Navbar() {
    const location = useLocation();

    return (
        <Menu className="navbar">
            <Link to={routes.PRODUCTS}>
                <MenuItem active={location.pathname === routes.PRODUCTS}>Products</MenuItem>
            </Link>
            <Link to={routes.CUSTOMERS}>
                <MenuItem active={location.pathname === routes.CUSTOMERS}>Customers</MenuItem>
            </Link>
            <Link to={routes.STORES}>
                <MenuItem active={location.pathname === routes.STORES}>Stores</MenuItem>
            </Link>
            <Link to={routes.SALES}>
                <MenuItem active={location.pathname === routes.SALES}>Sales</MenuItem>
            </Link>
        </Menu>
    );
}   