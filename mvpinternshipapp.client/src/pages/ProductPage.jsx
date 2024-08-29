import { useState, useEffect } from "react";
import { Confirm, Modal, ModalHeader, ModalContent, ModalActions, Button, Message } from "semantic-ui-react";
import api from '../api';
import DataTable from "../components/DataTable";
import { ProductDetails } from "../components/product/ProductDetails";



export function ProductPage() {
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

    function submitModalProduct() {
        setDetailModalState({ open: true, locked: true });
        let apiPromise;
        const isPostRequest = modalProduct.id === undefined
        apiPromise = isPostRequest ? api.createProduct(modalProduct) : apiPromise = api.updateProduct(modalProduct, modalProduct.id);
        apiPromise.then(() => {
            loadProducts();
            const verb = isPostRequest ? 'created' : 'updated'
            displayToast(`Product ${verb} successfully`, true);
        }).catch(() => displayToast("There was an error deleting the product", false))
            .finally(() => closeDetailModal());
    }

    function deleteProduct(productId) {
        api.deleteProduct(productId)
            .then(() => {
                loadProducts();
                displayToast("Product deleted successfully", true)
            }).catch(() => displayToast("There was an error deleting the product", false))
            .finally(() => setDeleteModalState({ id: undefined, open: false }));
    }

    function loadProducts() {
        api.getProducts()
            .then((res) => {
                if (res.data !== undefined && Array.isArray(res.data)) {
                    setProducts(res.data);
                }
            }).catch((error) => console.log(error.message));
    }

    function displayToast(message, success, time = 2000) {
        setToastState({ hidden: false, success, message });
        setTimeout(() => setToastState({ hidden: true, success, message }), time);
    }

    function isModalProductValid() {
        return modalProduct.name !== undefined
            && modalProduct.name !== ""
            && modalProduct.price !== undefined
            && modalProduct.price > 0;
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
                onCancel={() => setDeleteModalState({ id: undefined, open: false })}
                onConfirm={() => deleteProduct(deleteModalState.id)}
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
                        onClick={() => closeDetailModal()}
                        color='grey'
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={detailModalState.locked || !isModalProductValid()}
                        loading={detailModalState.locked}
                        color='green'
                        onClick={() => submitModalProduct()}
                    >
                        Save
                    </Button>
                </ModalActions>
            </Modal>  
        </div>
    );
}