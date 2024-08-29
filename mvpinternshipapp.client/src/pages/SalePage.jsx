import { useState, useEffect } from "react";
import { Confirm, Message, Modal, ModalHeader, ModalContent, ModalActions, Button } from "semantic-ui-react";
import api from '../api';

import DataTable from "../components/DataTable";
import { SaleDetails } from "../components/sale/SaleDetails";

export function SalePage() {
    const [sales, setSales] = useState([]);
    const [deleteModalState, setDeleteModalState] = useState({ id: undefined, open: false });
    const [detailModalState, setDetailModalState] = useState({ open: false, locked: false });
    const [toastState, setToastState] = useState({ hidden: true, success: true, message: "" });

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

    function submitModalSale() {
        setDetailModalState({ open: true, locked: true });
        let apiPromise;
        const isPostRequest = modalSale.id === undefined
        apiPromise = isPostRequest ? api.createSale(modalSale) : apiPromise = api.updateSale(modalSale, modalSale.id);
        apiPromise.then(() => {
            loadSales();
            const verb = isPostRequest ? 'created' : 'updated'
            displayToast(`Sale ${verb} successfully`, true);
        }).catch(() => displayToast("There was an error deleting the sale", false))
            .finally(() => closeDetailModal());
    }

    function deleteSale(saleId) {
        api.deleteSale(saleId)
            .then(() => {
                loadSales();
                displayToast("Sale deleted successfully", true)
            }).catch(() => displayToast("There was an error deleting the sale", false))
            .finally(() => setDeleteModalState({ id: undefined, open: false }));
    }

    function loadSales() {
        api.getSales()
            .then((res) => {
                if (res.data !== undefined && Array.isArray(res.data)) {
                    setSales(res.data);
                }
            }).catch((error) => console.log(error.message));
    }

    function displayToast(message, success, time = 2000) {
        setToastState({ hidden: false, success, message });
        setTimeout(() => setToastState({ hidden: true, success, message }), time);
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
            <Message
                className="toast floating bottom"
                content={toastState.message}
                hidden={toastState.hidden}
                success={toastState.success}
                error={!toastState.success}
            />
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
                onCancel={() => setDeleteModalState({ id: undefined, open: false })}
                onConfirm={() => deleteSale(deleteModalState.id)}
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
                        open={detailModalState.open}
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
                        onClick={() => submitModalSale()}
                    >
                        Save
                    </Button>
                </ModalActions>
            </Modal>
        </div>
    );
}