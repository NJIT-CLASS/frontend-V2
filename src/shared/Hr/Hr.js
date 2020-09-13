import React from "react"
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
    hrStyles: props => ({
        border: "1px solid #e7eaec",
        width: props.width,
        margin: "0 auto",
        marginBottom: "1rem"
    }),
}));

const Hr = ({style, className, ...props}) => {
    const classes = useStyles(props);
    return(
        <hr style={style} className={clsx(classes.hrStyles)}/>
    )

};

Hr.defaultProps = {
    width: "100%"
};

Hr.prototype = {
    className: PropTypes.string,
    style: PropTypes.object,
    width: PropTypes.string
};

export default Hr