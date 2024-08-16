import { useState, useEffect } from "react";
import axios from 'axios';

export function ProductTable() {
    const [products, setProducts] = useState([]);

    const loadProducts = () => {
        axios.get("https://localhost:7065/api/Product")
            .then((res) => {
                if (res.data !== undefined && Array.isArray(res.data)) {
                    setProducts(res.data);
                }
            })
    }; 
    useEffect(() => {
        loadProducts();
    }, [] )
    return (
        <div>
            <h2>Products</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Id</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.map(p => {
                            return (
                                <tr key={p.id}>
                                    <td>{p.name}</td>
                                    <td>{p.id}</td>
                                    <td>{p.price}</td>
                                    <td><button>Edit</button></td>
                                    <td><button>Delete</button></td>
                                </tr>
                            );
                        })
                    }
                </tbody>
                
            </table>
            <button onClick={loadProducts}>load</button>
        </div>
    );
}