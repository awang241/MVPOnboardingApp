import { useState, useEffect } from "react";
import { Confirm, Message, Modal, ModalHeader, ModalContent, ModalActions, Button, Icon } from "semantic-ui-react";
import { StoreDetails } from "../components/store/StoreDetails";
import api from "../api";
import DataTable from "../components/DataTable";

export function StorePage() {
    const [stores, setStores] = useState([]);
    const [deleteModalState, setDeleteModalState] = useState({ id: undefined, open: false });
    const [detailModalState, setDetailModalState] = useState({ open: false, locked: false });
    const [toastState, setToastState] = useState({ hidden: true, success: true, message: "" });
    const [modalStore, setModalStore] = useState({});
    const [loading, setLoading] = useState(true);


    const closeDetailModal = () => {
        setModalStore({});
        setDetailModalState({ open: false, locked: false });
    }

    const openDetailModal = (store = {}) => {
        if (store.id !== undefined) {
            setModalStore({ id: store.id, name: store.name, address: store.address })
        } else {
            setModalStore({ id: undefined, name: "", price: "" })
        }
        setDetailModalState({ open: true, locked: false });
    }

    const openDeleteModal = (storeId) => {
        if (Number.isInteger(storeId)) {
            setDeleteModalState({ id: storeId, open: true });
        } else {
            throw Error("storeId must be an integer");
        }
    }

    const submitModalStore = () => {
        setDetailModalState({ open: true, locked: true });
        let apiPromise;
        const isPostRequest = modalStore.id === undefined
        apiPromise = isPostRequest ? api.createStore(modalStore) : apiPromise = api.updateStore(modalStore, modalStore.id);
        apiPromise.then(() => {
            loadStores();
            const verb = isPostRequest ? 'created' : 'updated'
            displayToast(`Store ${verb} successfully`, true);
        }).catch(() => displayToast("There was an error deleting the store", false))
            .finally(() => closeDetailModal());
    }

    const deleteStore = (productId) => {
        api.deleteStore(productId)
            .then(() => {
                loadStores();
                displayToast("Store deleted successfully", true)
            }).catch(() => displayToast("There was an error deleting the store", false))
            .finally(() => setDeleteModalState({ id: undefined, open: false }));
    }

    const loadStores = () => {
        setLoading(true);
        api.getStores()
            .then((res) => {
                if (res.data !== undefined && Array.isArray(res.data)) {
                    setStores(res.data);
                }
            }).catch(() => displayToast("There was an error loading stores", false))
            .finally(() => setLoading(false));
    }

    const displayToast = (message, success, time=2000) => {
        setToastState({ hidden: false, success, message });
        setTimeout(() => setToastState({ hidden: true, success, message }), time);
    }

    const isModalStoreValid = () => {
        return modalStore.name !== undefined
            && modalStore.name !== ""
            && modalStore.address !== undefined
            && modalStore.address !== "";
    }

    const createCells = (product) => {
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
            <Button primary onClick={() => openDetailModal()}><Icon name='add' />Add</Button>
            <Message
                className="toast floating bottom"
                content={toastState.message}
                hidden={toastState.hidden}
                success={toastState.success}
                error={!toastState.success}
            />
            <DataTable
                data={stores}
                headers={["Store Name", "Address"]}
                dataCellsMapper={createCells}
                emptyMessage="There are currently no stores."
                loading={loading}
                onClickEdit={openDetailModal}
                onClickDelete={(p) => openDeleteModal(p.id)}
            />

            <Confirm
                content={`Are you sure you want to delete this store?`}
                open={deleteModalState.open}
                onCancel={() => setDeleteModalState({ id: undefined, open: false })}
                onConfirm={() => deleteStore(deleteModalState.id)}
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
                        onClick={() => closeDetailModal()}
                        color='grey'
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={detailModalState.locked || !isModalStoreValid()}
                        loading={detailModalState.locked}
                        color='green'
                        onClick={() => submitModalStore()}
                    >
                        Save
                    </Button>
                </ModalActions>
            </Modal>
        </div>
    );
}