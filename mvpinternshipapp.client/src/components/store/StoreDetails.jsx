import { Input, Label } from "semantic-ui-react";
import PropTypes from 'prop-types';

export function StoreDetails({ state, setState }) {
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