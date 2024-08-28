import { useState, useEffect } from "react";
import { Confirm, Modal, ModalHeader, ModalContent, ModalActions, Button, Message } from "semantic-ui-react";
import PropTypes from 'prop-types';
import axios from 'axios';
import DataTable from "../components/DataTable";
import './ProductPage.css';
import { ProductDetails } from "../components/product/ProductDetails";



export function ProductPage({ endpointUrl = "/api/Product" }) {
    const [products, setProducts] = useState([]);
    const [deleteModalState, setDeleteModalState] = useState({ id: undefined, open: false });
    const [detailModalState, setDetailModalState] = useState({ open: false, locked: false });
    const [toastState, setToastState] = useState({ hidden: true, success: true, message: "" });
    const [modalProduct, setModalProduct] = useState({});

    function closeDetailModal() {
        setModalProduct({});
        setDetailModalState({ open: false, locked: false });
    }

    function openDetailModal(product = {}) {
        if (product.id !== undefined) {
            setModalProduct({ id: product.id, name: product.name, price: product.price })
        } else {
            setModalProduct({ id: undefined, name: "", price: 0})
        }
        setDetailModalState({ open: true, locked: false });
    }

    function openDeleteModal(productId) {
        if (Number.isInteger(productId)) {
            setDeleteModalState({ id: productId, open: true });
        } else {
            throw Error("productId must be an integer");
        }
    }

    function closeDeleteModal() {
        setDeleteModalState({ id: undefined, open: false });
    }

    async function submitModalProduct() {
        let url, method;
        if (modalProduct.id === undefined) {
            method = "post";
            url = endpointUrl;
        } else {
            method = "put";
            url = endpointUrl  + `/${modalProduct.id}`;
        }
        await axios.request({
            url,
            method,
            data: { ...modalProduct },
        });
    }

    async function deleteProduct(productId) {
        await axios.delete(endpointUrl + `/${productId}`);
    }

    async function loadProducts() {
        await axios.get(endpointUrl)
            .then((res) => {
                if (res.data !== undefined && Array.isArray(res.data)) {
                    setProducts(res.data);
                }
            })
    }

    function isModalProductValid() {
        return modalProduct.name !== undefined && modalProduct.name !== "" && modalProduct.price !== undefined && modalProduct.price > 0;
    }

    function createCells(product) {
        return (
            <>
                <td>{product.name}</td>
                <td>{product.price.toLocaleString(undefined, { style: "currency", currency: "NZD" })}</td>
            </>
        );
    }
    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <div>
            <h2>Products</h2>
            <Button primary onClick={() => openDetailModal()}>Add</Button>
            <Message
                className="toast floating bottom"
                content={toastState.message}
                hidden={toastState.hidden}
                success={toastState.success}
                error={!toastState.success}
            />

            <DataTable
                data={products}
                headers={["Product Name", "Price"]}
                dataCellsMapper={createCells}
                onClickEdit={openDetailModal}
                onClickDelete={(p) => openDeleteModal(p.id)}    
            />

            <Confirm
                content={`Are you sure you want to delete this product?`}
                open={deleteModalState.open}
                onCancel={() => closeDeleteModal()}
                onConfirm={() => {
                    deleteProduct(deleteModalState.id)
                        .then(() => {
                            closeDeleteModal();
                            loadProducts();
                        });
                    
                }}
            />
            <Modal
                open={detailModalState.open}
                closeOnDimmerClick={false}
            >
                <ModalHeader>{modalProduct.id === undefined ? "Create New Product" : "Editing Product"}</ModalHeader>
                <ModalContent>
                    <ProductDetails
                        state={modalProduct}
                        setState={setModalProduct}
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
                        disabled={detailModalState.locked || !isModalProductValid()}
                        loading={detailModalState.locked}
                        color='green'
                        onClick={() => {
                                setDetailModalState({ open: true, locked: true });
                                submitModalProduct().then(() => {
                                    closeDetailModal();
                                    loadProducts();
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

ProductPage.propTypes = {
    endpointUrl: PropTypes.string,
}