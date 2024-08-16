import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios';

function getKeysOfObjectArray(array) {
    return array.reduce((keys, obj) => {
        if (!Array.isArray(obj)) {
            let newKeys = new Set(Object.keys(obj));
            return keys.union(newKeys);
        } else return keys
    }, new Set());
}

export default function DataTable(props) {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const location = useLocation();

    const loadCustomers = () => {
        setData([]);
        axios.get(props.url)
            .then((res) => {
                if (res.data !== undefined && Array.isArray(res.data) && res.data.every(x => typeof x === 'object')) {
                    let a = Array.from(getKeysOfObjectArray(res.data));
                    setColumns(a);
                    setData(res.data);                    
                }
            })
    }; 

    const createRow = (dataObj) => {
        return (
            <>
                {
                    columns.map(x => <th key={x}>{dataObj[x]}</th>)
                }
                <th><button>Edit</button></th>
                <th><button>Delete</button></th>
            </>
        )
    }
    useEffect(() => {
        loadCustomers();
    }, [location])
    return (
        <div>
            <h2>Customers</h2>

            {data === undefined || data.length === 0 ?
                <p>Loading...</p>
                : <table>
                    <thead>
                        <tr>
                            {
                                columns.map(x => <th key={x}>{x}</th>)
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map(p => {
                                return (
                                    <tr key={p.id}>
                                        {createRow(p)}
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>}
        </div>
    );
}