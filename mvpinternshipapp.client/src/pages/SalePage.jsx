import { useState, useEffect } from "react";
import { Confirm, Input, Label, Modal, ModalHeader, ModalContent, ModalActions, Button, Dropdown } from "semantic-ui-react";
import api from '../api'

import PropTypes from 'prop-types';
import axios from 'axios';
import DataTable from "../components/DataTable";
import './SalePage.css';
const ENDPOINT_URL = "/api/Sale"

function SaleDetails({ state, setState, isOpen }) {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);

    useEffect(() => {
        if (isOpen) {
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
    }, [isOpen])

    return (
        <div className="sale-details">
            <Label size='large' as='p'>Date Sold</Label>
            <Input
                type="date"
                defaultValue={state?.dateSold?.split('T')[0]}
                onChange={(e) => setState((sale) => ({ ...sale, dateSold: e.target.value }))}
            />
            <Label size='large' as='p'>Products</Label>
            <Dropdown
                defaultValue={state?.productId}
                placeholder='Select Product'
                fluid
                selection
                options={products}
                onChange={
                    (e, data) => setState((sale) => {
                        const { key, text } = products.find((product) => product.value === data.value);
                        return { ...sale, productId: key, productName: text };
                    })
                }
            />
            <Label size='large' as='p'>Customers</Label>
            <Dropdown
                fluid
                selection
                defaultValue={state?.customerId}
                placeholder='Select Customer'
                options={customers}
                onChange={
                    (e, data) => setState((sale) => {
                        const { key, text } = customers.find((customer) => customer.value === data.value);
                        return { ...sale, customerId: key, customerName: text };
                    })
                }
            />
            <Label size='large' as='p'>Store</Label>
            <Dropdown
                fluid
                search
                selection
                defaultValue={state?.storeId}
                placeholder='Select Store'
                options={stores}
                onChange={
                    (e, data) => setState((sale) => {
                        const { key, text } = stores.find((store) => store.value === data.value);
                        return { ...sale, storeId: key, storeName: text };
                    })
                }
            />
        </div>
    );
}

SaleDetails.propTypes = {
    state: PropTypes.object,
    setState: PropTypes.func,
    isOpen: PropTypes.bool
}
export function SalePage() {
    const [sales, setSales] = useState([]);
    const [deleteModalState, setDeleteModalState] = useState({ id: undefined, open: false });
    const [detailModalState, setDetailModalState] = useState({ open: false, locked: false });
    const [modalSale, setModalSale] = useState({});

    function closeDetailModal() {
        setModalSale({});
        setDetailModalState({ open: false, locked: false });
    }

    function openDetailModal(sale = {}) {
        if (sale.id !== undefined) {
            setModalSale({ ...sale })
        } else {
            setModalSale({
                id: undefined,
                dateSold: "",
                productId: undefined,
                productName: "",
                customerId: undefined,
                customerName: "",
                storeId: undefined,
                storeName: "",
            })
        }
        setDetailModalState({ open: true, locked: false });
    }

    function openDeleteModal(saleId) {
        if (Number.isInteger(saleId)) {
            setDeleteModalState({ id: saleId, open: true });
        } else {
            throw Error("saleId must be an integer");
        }
    }

    function closeDeleteModal() {
        setDeleteModalState({ id: undefined, open: false });
    }

    async function submitModalSale() {
        let url, method;
        if (modalSale.id === undefined) {
            method = "post";
            url = ENDPOINT_URL;
        } else {
            method = "put";
            url = ENDPOINT_URL + `/${modalSale.id}`;
        }
        await axios.request({
            url,
            method,
            data: { ...modalSale },
        });
    }

    async function deleteSale(productId) {
        await axios.delete(ENDPOINT_URL + `/${productId}`);
    }

    async function loadSales() {
        await axios.get(ENDPOINT_URL)
            .then((res) => {
                if (res.data !== undefined && Array.isArray(res.data)) {
                    setSales(res.data);
                }
            })
    }

    function isModalSaleValid() {
        return modalSale.dateSold !== undefined
            && modalSale.dateSold !== ""
            && Number.isInteger(modalSale.customerId)
            && Number.isInteger(modalSale.productId)
            && Number.isInteger(modalSale.storeId)
    }

    function createCells(sale) {
        return (
            <>
                <td>{sale.productName}</td>
                <td>{sale.customerName}</td>
                <td>{sale.storeName}</td>
                <td>{sale.dateSold.split('T')[0]}</td>
            </>
        );
    }
    useEffect(() => {
        loadSales();
    }, []);
    return (
        <div>
            <h2>Sales</h2>
            <Button primary onClick={() => openDetailModal()}>Add</Button>

            <DataTable
                data={sales}
                headers={["Product", "Customer", "Store", "Date Sold"]}
                dataCellsMapper={createCells}
                onClickEdit={openDetailModal}
                onClickDelete={(p) => openDeleteModal(p.id)}
            />

            <Confirm
                content={`Are you sure you want to delete this sale?`}
                open={deleteModalState.open}
                onCancel={() => closeDeleteModal()}
                onConfirm={() => {
                    deleteSale(deleteModalState.id)
                        .then(() => {
                            closeDeleteModal();
                            loadSales();
                        });

                }}
            />
            <Modal
                open={detailModalState.open}
                closeOnDimmerClick={false}
            >
                <ModalHeader>{modalSale.id === undefined ? "Create New Sale" : "Editing Sale"}</ModalHeader>
                <ModalContent>
                    <SaleDetails
                        state={modalSale}
                        setState={setModalSale}
                        isOpen={detailModalState.open}
                    />
                </ModalContent>
                <ModalActions>
                    <Button
                        disabled={detailModalState.locked}
                        onClick={() => closeDetailModal()} color='grey'
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={detailModalState.locked || !isModalSaleValid()}
                        loading={detailModalState.locked}
                        color='green'
                        onClick={() => {
                            setDetailModalState({ open: true, locked: true });
                            submitModalSale().then(() => {
                                closeDetailModal();
                                loadSales();
                            });
                        }
                        }
                    >
                        Save
                    </Button>
                </ModalActions>
            </Modal>
        </div>
    );
}