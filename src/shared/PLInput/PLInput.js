import React from "react";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types"

const PLInput = (props) => {
    const {placeholder, onChange, fullWidth, defaultValue, style} = props;
    return (
        <TextField
            style={style}
            variant={"outlined"}
            size={"medium"}
            placeholder={placeholder}
            onChange={onChange}
            label={placeholder}
            fullWidth={fullWidth}
            defaultValue={defaultValue}
            {...props}
        />
    )
};

PLInput.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  fullWidth: PropTypes.bool,
  defaultValue: PropTypes.string,
  style: PropTypes.object
};

export default PLInput;