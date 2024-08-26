import { useState, useEffect } from "react";
import axios from 'axios';
import { Confirm, Input, Label, Modal, ModalHeader, ModalContent, ModalActions, Button } from "semantic-ui-react";
import DataTable from "../components/DataTable";
import PropTypes from 'prop-types'
import './StorePage.css';

const ENDPOINT_URL = "/api/Store";

function StoreDetails({ state, setState }) {
    return (
        <div className="store-details">
            <Label size='large' as='p'>Name</Label>
            <Input
                defaultValue={state?.name}
                onChange={(e) => setState((product) => ({ ...product, name: e.target.value }))}
            />
            <Label size='large' as='p'>Address</Label>
            <Input
                className="address-input"
                defaultValue={state?.address}
                onChange={(e) => setState((product) => ({ ...product, address: e.target.value }))}
            />
        </div>
    );
}

StoreDetails.propTypes = {
    state: PropTypes.object,
    setState: PropTypes.func
}
export function StorePage() {
    const [stores, setStores] = useState([]);
    const [deleteModalState, setDeleteModalState] = useState({ id: undefined, open: false });
    const [detailModalState, setDetailModalState] = useState({ open: false, locked: false });
    const [modalStore, setModalStore] = useState({});

    function closeDetailModal() {
        setModalStore({});
        setDetailModalState({ open: false, locked: false });
    }

    function openDetailModal(store = {}) {
        if (store.id !== undefined) {
            setModalStore({ id: store.id, name: store.name, address: store.address })
        } else {
            setModalStore({ id: undefined, name: "", price: "" })
        }
        setDetailModalState({ open: true, locked: false });
    }

    function openDeleteModal(storeId) {
        if (Number.isInteger(storeId)) {
            setDeleteModalState({ id: storeId, open: true });
        } else {
            throw Error("storeId must be an integer");
        }
    }

    function closeDeleteModal() {
        setDeleteModalState({ id: undefined, open: false });
    }

    async function submitModalStore() {
        let url, method;
        if (modalStore.id === undefined) {
            method = "post";
            url = ENDPOINT_URL;
        } else {
            method = "put";
            url = ENDPOINT_URL + `/${modalStore.id}`;
        }
        await axios.request({
            url,
            method,
            data: { ...modalStore },
        });
    }

    async function deleteStore(productId) {
        await axios.delete(ENDPOINT_URL + `/${productId}`);
    }

    async function loadStores() {
        await axios.get(ENDPOINT_URL)
            .then((res) => {
                if (res.data !== undefined && Array.isArray(res.data)) {
                    setStores(res.data);
                }
            })
    }

    function isModalStoreValid() {
        return modalStore.name !== undefined
            && modalStore.name !== ""
            && modalStore.address !== undefined
            && modalStore.address !== "";
    }

    function createCells(product) {
        return (
            <>
                <td>{product.name}</td>
                <td>{product.address}</td>
            </>
        );
    }
    useEffect(() => {
        loadStores();
    }, []);
    return (
        <div>
            <h2>Stores</h2>
            <Button primary onClick={() => openDetailModal()}>Add</Button>

            <DataTable
                data={stores}
                headers={["Store Name", "Address"]}
                dataCellsMapper={createCells}
                onClickEdit={openDetailModal}
                onClickDelete={(p) => openDeleteModal(p.id)}
            />

            <Confirm
                content={`Are you sure you want to delete this store?`}
                open={deleteModalState.open}
                onCancel={() => closeDeleteModal()}
                onConfirm={() => {
                    deleteStore(deleteModalState.id)
                        .then(() => {
                            closeDeleteModal();
                            loadStores();
                        });

                }}
            />
            <Modal
                open={detailModalState.open}
                closeOnDimmerClick={false}
            >
                <ModalHeader>{modalStore.id === undefined ? "Create New Store" : "Editing Store"}</ModalHeader>
                <ModalContent>
                    <StoreDetails
                        state={modalStore}
                        setState={setModalStore}
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
                        disabled={detailModalState.locked || !isModalStoreValid()}
                        loading={detailModalState.locked}
                        color='green'
                        onClick={() => {
                            setDetailModalState({ open: true, locked: true });
                            submitModalStore().then(() => {
                                closeDetailModal();
                                loadStores();
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