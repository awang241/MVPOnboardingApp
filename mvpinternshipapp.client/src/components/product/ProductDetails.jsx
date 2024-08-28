import { Input, Label } from "semantic-ui-react";
import PropTypes from 'prop-types';

export function ProductDetails({ state, setState }) {
    return (
        <div className="detail-grid">
            <Label as='p'>Name</Label>
            <Input
                defaultValue={state.name}
                onChange={(e) => setState((product) => ({ ...product, name: e.target.value }))}
            />
            <Label as='p'>Price</Label>
            <Input
                label="$"
                defaultValue={state.price}
                type="number"
                onChange={(e) => setState((product) => ({ ...product, price: e.target.value }))}
            />
        </div>
    )
}

ProductDetails.propTypes = {
    state: PropTypes.object,
    setState: PropTypes.func
}