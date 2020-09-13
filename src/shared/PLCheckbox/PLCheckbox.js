import React from "react";
import Checkbox from "@material-ui/core/Checkbox";

import PropTypes from "prop-types"

const PLCheckbox = (props) => {
    const {checked, onChange} = props;

    return (
        <Checkbox checked={checked} onChange={onChange} color={"primary"}/>
    )
};

PLCheckbox.propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func
};

export default PLCheckbox;