import { useState, useEffect } from "react";
import { Confirm, Message, Modal, ModalHeader, ModalContent, ModalActions, Button } from "semantic-ui-react";

import PropTypes from 'prop-types';
import axios from 'axios';
import DataTable from "../components/DataTable";
import CustomerDetails from "../components/customer/CustomerDetails";

export function CustomerPage({endpointUrl="/api/Customer"}) {
    const [customers, setCustomers] = useState([]);
    const [deleteModalState, setDeleteModalState] = useState({ id: undefined, open: false });
    const [detailModalState, setDetailModalState] = useState({ open: false, locked: false });
    const [toastState, setToastState] = useState({ hidden: true, success: true, message: "" });
    const [modalCustomer, setModalCustomer] = useState({});

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

    function closeDeleteModal() {
        setDeleteModalState({ id: undefined, open: false });
    }

    async function submitModalCustomer() {
        let url, method;
        if (modalCustomer.id === undefined) {
            method = "post";
            url = endpointUrl;
        } else {
            method = "put";
            url = endpointUrl + `/${modalCustomer.id}`;
        }
        await axios.request({
            url,
            method,
            data: { ...modalCustomer },
        });
    }

    async function deleteCustomer(customerId) {
        await axios.delete(endpointUrl + `/${customerId}`);
    }

    async function loadCustomer() {
        await axios.get(endpointUrl)
            .then((res) => {
                if (res.data !== undefined && Array.isArray(res.data)) {
                    setCustomers(res.data);
                }
            })
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
        loadCustomer();
    }, []);
    return (
        <div>
            <h2>Customers</h2>
            <Button primary onClick={() => openDetailModal()}>Add</Button>
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
                onClickEdit={openDetailModal}
                onClickDelete={(p) => openDeleteModal(p.id)}
            />

            <Confirm
                content={`Are you sure you want to delete this customer?`}
                open={deleteModalState.open}
                onCancel={() => closeDeleteModal()}
                onConfirm={() => {
                    deleteCustomer(deleteModalState.id)
                        .then(() => {
                            closeDeleteModal();
                            loadCustomer();
                        });

                }}
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
                        onClick={() => {
                            setDetailModalState({ open: true, locked: true });
                            submitModalCustomer().then(() => {
                                closeDetailModal();
                                loadCustomer();
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

CustomerPage.propTypes = {
    endpointUrl: PropTypes.string,
}