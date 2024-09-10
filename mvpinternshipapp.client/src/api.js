import axios from 'axios';

const instance = axios.create({
    timeout: 10000
});

const PRODUCTS_ENDPOINT = '/api/Product';
const CUSTOMERS_ENDPOINT = '/api/Customer';
const STORES_ENDPOINT = '/api/Store';
const SALES_ENDPOINT = '/api/Sale';

export default {
    getProducts: () => instance.get(PRODUCTS_ENDPOINT),
    createProduct: (product) => instance.post(PRODUCTS_ENDPOINT, product),
    updateProduct: (product, id) => instance.put(`${PRODUCTS_ENDPOINT}/${id}`, product),
    deleteProduct: (id) => instance.delete(`${PRODUCTS_ENDPOINT}/${id}`),

    getCustomers: () => instance.get(CUSTOMERS_ENDPOINT),
    createCustomer: (customer) => instance.post(CUSTOMERS_ENDPOINT, customer),
    updateCustomer: (customer, id) => instance.put(`${CUSTOMERS_ENDPOINT}/${id}`, customer),
    deleteCustomer: (id) => instance.delete(`${CUSTOMERS_ENDPOINT}/${id}`),

    getStores: () => instance.get(STORES_ENDPOINT),
    createStore: (store) => instance.post(STORES_ENDPOINT, store),
    updateStore: (store, id) => instance.put(`${STORES_ENDPOINT}/${id}`, store),
    deleteStore: (id) => instance.delete(`${STORES_ENDPOINT}/${id}`),

    getSales: () => instance.get(SALES_ENDPOINT),
    createSale: (sale) => instance.post(SALES_ENDPOINT, sale),
    updateSale: (sale, id) => instance.put(`${SALES_ENDPOINT}/${id}`, sale),
    deleteSale: (id) => instance.delete(`${SALES_ENDPOINT}/${id}`),
}