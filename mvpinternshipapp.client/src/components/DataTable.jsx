import { Button, Loader } from "semantic-ui-react";
import PropTypes from 'prop-types';

export default function DataTable({
    headers,
    dataCellsMapper,
    data,
    loading,
    emptyMessage,
    onClickEdit,
    onClickDelete,
}) {
    const createRow = (dataObj) => {
        return (
            <tr key={dataObj.id} >
                {dataCellsMapper(dataObj)}
                <td>
                    <Button color='yellow' onClick={() => onClickEdit(dataObj)}>Edit</Button>

                    <Button color='red' onClick={() => onClickDelete(dataObj)}>Delete</Button>
                </td>

            </tr>
        )
    }

    const renderContents = () => {
        if (loading) {
            return <Loader active>Loading</Loader>;
        } else if (data.length === 0) {
            return <p style={{ margin: "15px" }}>{emptyMessage}</p>
        } else {
            return (
                <table className="data-table" style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            {headers.map((header) => <th key={header}>{header}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(dataObj => createRow(dataObj))}
                    </tbody>
                </table>
            );
        }
    }
    return (
        <>
            {renderContents()}
        </>
    );
}

DataTable.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.node),
    dataCellsMapper: PropTypes.func,
    data: PropTypes.array,
    emptyMessage: PropTypes.string,
    loading: PropTypes.bool,
    onClickEdit: PropTypes.func,
    onClickDelete: PropTypes.func,
}