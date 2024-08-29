import { useState, useEffect } from "react";
import { Confirm, Message, Modal, ModalHeader, ModalContent, ModalActions, Button, Icon } from "semantic-ui-react";

import api from '../api';
import DataTable from "../components/DataTable";
import CustomerDetails from "../components/customer/CustomerDetails";

export function CustomerPage() {
    const [customers, setCustomers] = useState([]);
    const [deleteModalState, setDeleteModalState] = useState({ id: undefined, open: false });
    const [detailModalState, setDetailModalState] = useState({ open: false, locked: false });
    const [toastState, setToastState] = useState({ hidden: true, success: true, message: "" });
    const [modalCustomer, setModalCustomer] = useState({});
    const [loading, setLoading] = useState(true);

    function closeDetailModal() {
        setModalCustomer({});
        setDetailModalState({ open: false, locked: false });
    }

    function openDetailModal(customer = {}) {
        if (customer.id !== undefined) {
            setModalCustomer({ id: customer.id, name: customer.name, address: customer.address })
        } else {
            setModalCustomer({ id: undefined, name: "", price: 0 })
        }
        setDetailModalState({ open: true, locked: false });
    }

    function openDeleteModal(customerId) {
        if (Number.isInteger(customerId)) {
            setDeleteModalState({ id: customerId, open: true });
        } else {
            throw Error("customerId must be an integer");
        }
    }

    function submitModalCustomer() {
        setDetailModalState({ open: true, locked: true });
        let apiPromise;
        const isPostRequest = modalCustomer.id === undefined
        apiPromise = isPostRequest ? api.createCustomer(modalCustomer) : apiPromise = api.updateCustomer(modalCustomer, modalCustomer.id);
        apiPromise.then(() => {
            loadCustomers();
            const verb = isPostRequest ? 'created' : 'updated'
            displayToast(`Customer ${verb} successfully`, true);
        }).catch(() => displayToast("There was an error deleting the customer", false))
        .finally(() => closeDetailModal());
    }

    function deleteCustomer(customerId) {
        api.deleteCustomer(customerId)
            .then(() => {
                loadCustomers();
                displayToast("Customer deleted successfully", true)
            }).catch(() => displayToast("There was an error deleting the customer", false))
            .finally(() => setDeleteModalState({ id: undefined, open: false }));
    }

    function loadCustomers() {
        setLoading(true);
        api.getCustomers()
            .then((res) => {
                if (res.data !== undefined && Array.isArray(res.data)) {
                    setCustomers(res.data);
                }
            }).catch(() => displayToast("There was an error loading customers", false))
            .finally(() => setLoading(false));
    }

    function displayToast(message, success, time = 2000) {
        setToastState({ hidden: false, success, message });
        setTimeout(() => setToastState({ hidden: true, success, message }), time);
    }

    function isModalCustomerValid() {
        return modalCustomer.name !== undefined
            && modalCustomer.name !== ""
            && modalCustomer.address !== undefined
            && modalCustomer.address !== "";
    }

    function createCells(customer) {
        return (
            <>
                <td>{customer.name}</td>
                <td>{customer.address}</td>
            </>
        );
    }
    useEffect(() => {
        loadCustomers();
    }, []);
    return (
        <div>
            <h2>Customers</h2>
            <Button primary onClick={() => openDetailModal()}><Icon name='add' />Add</Button>
            <Message
                className="toast floating bottom"
                content={toastState.message}
                hidden={toastState.hidden}
                success={toastState.success}
                error={!toastState.success}
            />
            <DataTable
                data={customers}
                headers={["Customer Name", "Address"]}
                dataCellsMapper={createCells}
                emptyMessage="There are currently no customers."
                loading={loading}
                onClickEdit={openDetailModal}
                onClickDelete={(p) => openDeleteModal(p.id)}
            />

            <Confirm
                content={`Are you sure you want to delete this customer?`}
                open={deleteModalState.open}
                onCancel={() => setDeleteModalState({ open: false, id: undefined })}
                onConfirm={() => deleteCustomer(deleteModalState.id) }
            />
            <Modal
                open={detailModalState.open}
                closeOnDimmerClick={false}
            >
                <ModalHeader>{modalCustomer.id === undefined ? "Create New Customer" : "Editing Customer"}</ModalHeader>
                <ModalContent>
                    <CustomerDetails
                        state={modalCustomer}
                        setState={setModalCustomer}
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
                        disabled={detailModalState.locked || !isModalCustomerValid()}
                        loading={detailModalState.locked}
                        color='green'
                        onClick={() => submitModalCustomer()}
                    >
                        Save
                    </Button>
                </ModalActions>
            </Modal>
        </div>
    );
}