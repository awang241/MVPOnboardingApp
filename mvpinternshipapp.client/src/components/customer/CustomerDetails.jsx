import { Input, Label } from "semantic-ui-react";
import PropTypes from 'prop-types';

export default function CustomerDetails({ state, setState }) {
    return (
        <div className="detail-grid">
            <Label size='large' as='p'>Name</Label>
            <Input
                defaultValue={state?.name}
                onChange={(e) => setState((customer) => ({ ...customer, name: e.target.value }))}
            />
            <Label size='large' as='p'>Address</Label>
            <Input
                className="address-input"
                defaultValue={state?.address}
                onChange={(e) => setState((customer) => ({ ...customer, address: e.target.value }))}
            />
        </div>
    );
}

CustomerDetails.propTypes = {
    state: PropTypes.object,
    setState: PropTypes.func
}