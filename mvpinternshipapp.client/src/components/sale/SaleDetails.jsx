import { Input, Label, Dropdown } from "semantic-ui-react";
import { useState, useEffect } from 'react';
import api from '../../api';

import PropTypes from 'prop-types';

export function SaleDetails({ state, setState, open }) {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);

    useEffect(() => {
        if (open) {
            let stillAlive = true;
            const mapToOptions = (objArray) => {
                return objArray.map(obj => ({
                    key: obj.id,
                    value: obj.id,
                    text: obj.name,
                }));
            };
            api.getCustomers().then((res) => {
                if (stillAlive) {
                    setCustomers(mapToOptions(res.data));
                }
            });
            api.getProducts().then((res) => {
                if (stillAlive) {
                    setProducts(mapToOptions(res.data));
                }
            });
            api.getStores().then((res) => {
                if (stillAlive) {
                    setStores(mapToOptions(res.data));
                }
            });
            return () => (stillAlive = false);
        }
    }, [open])

    const setProduct = (productId) => {
        const { key, text } = products.find((product) => product.value === productId);
        if (Number.isInteger(key) && text !== undefined) {
            setState((sale) => ({ ...sale, productId: key, productName: text }) );
        } else {
            console.log(`Error setting product with id ${key} and name ${text}`);
        }
    }

    const setCustomer = (customerId) => {
        const { key, text } = customers.find((customer) => customer.value === customerId);
        if (Number.isInteger(key) && text !== undefined) {
            setState((sale) => ({ ...sale, customerId: key, customerName: text }));
        } else {
            console.log(`Error setting customer with id ${key} and name ${text}`);
        }
    }

    const setStore = (storeId) => {
        const { key, text } = stores.find((store) => store.value === storeId);
        if (Number.isInteger(key) && text !== undefined) {
            setState((sale) => ({ ...sale, storeId: key, storeName: text }));
        } else {
            console.log(`Error setting store with id ${key} and name ${text}`);
        }
    }

    return (
        <div className="sale-details">
            <Label size='large' as='p'>Date Sold</Label>
            <Input
                defaultValue={state?.dateSold?.split('T')[0]}
                onChange={(e) => setState((sale) => ({ ...sale, dateSold: e.target.value }))}
                type="date"
            />
            <Label size='large' as='p'>Products</Label>
            <Dropdown
                defaultValue={state?.productId}
                fluid
                onChange={(e, data) => setProduct(data.value)}
                options={products}
                placeholder='Select Product'
                selection
            />
            <Label size='large' as='p'>Customers</Label>
            <Dropdown
                defaultValue={state?.customerId}
                fluid
                onChange={(e, data) => setCustomer(data.value)}
                options={customers}
                placeholder='Select Customer'
                selection
            />
            <Label size='large' as='p'>Store</Label>
            <Dropdown
                defaultValue={state?.storeId}
                fluid
                onChange={(e, data) => setStore(data.value)}
                options={stores}
                placeholder='Select Store'
                selection
            />
        </div>
    );
}

SaleDetails.propTypes = {
    state: PropTypes.object.isRequired,
    setState: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
}