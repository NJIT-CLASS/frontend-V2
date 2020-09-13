import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import PropTypes from "prop-types"
import Chip from "@material-ui/core/Chip";


const useStyles = makeStyles((theme) => ({
    formControl: (props) =>  ({
        margin: theme.spacing(1),
        width: props.width,
        minWidth: 220,
    }),

    selectEmpty: {
        marginTop: theme.spacing(2),
    },

    selectRoot: {
        backgroundColor: "white",
        padding: "1rem"
    },

    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 1,
    },
}));

const PLSelect = (props) => {
    const classes = useStyles(props);
    const {placeholder, onChange, value, name, defaultValue, multiple, children, disabled, options, includeNone} = props;

    return (
        <FormControl variant="outlined" className={classes.formControl} disabled={disabled}>
            <InputLabel>{placeholder}</InputLabel>
            {!multiple ?
                <Select
                    value={value}
                    onChange={onChange}
                    label={placeholder}
                    classes={{root: classes.selectRoot}}
                    defaultValue={defaultValue}
                    name={name}
                >
                    {includeNone ? (
                        <MenuItem value='' dense>
                            <em>None</em>
                        </MenuItem>
                    ) : null}
                    {options ? (
                        options.map(({value, label}) => {
                            return <MenuItem value={value} key={value}>{label}</MenuItem>
                        })
                    ) : children}
                </Select>:
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={value}
                    onChange={onChange}
                    label={placeholder}
                    classes={{root: classes.selectRoot}}
                    defaultValue={defaultValue}
                    multiple={multiple}
                    renderValue={(selected) => (
                        <div className={classes.chips}>
                            {selected.map((value, index) => (
                                <Chip key={index} label={value.label} className={classes.chip}/>
                            ))}
                        </div>
                    )}
                    name={name}
                >
                    {options ? (
                        options.map(({value, label}) => {
                            return <MenuItem value={value} key={value}>{label}</MenuItem>
                        })
                    ) : children}
                </Select>
            }
        </FormControl>
    )
};

PLSelect.propTypes = {
    value: PropTypes.any.isRequired,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    name: PropTypes.string,
    multiple: PropTypes.bool,
    disabled: PropTypes.bool,
    values: PropTypes.object,
    includeNone: PropTypes.bool,
    defaultValue: PropTypes.string

};

PLSelect.defaultProps = {
    placeholder: "value",
    includeNone: true
};

export default PLSelect