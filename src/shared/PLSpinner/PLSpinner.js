import React from "react";
import ReactLoading from 'react-loading'
import PropTypes from 'prop-types'
import {makeStyles, useTheme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    spinnerContainer: (props) => ({
        display: 'flex',
        justifyContent: 'center'
    }),
}));

const PLSpinner = ({type, color, height, width, style}) => {
    const {palette} = useTheme();
    const classes = useStyles();
    let spinnerColor = color ? color: palette.primary.main;
    return (
        <div className={classes.spinnerContainer} style={style}>
            <ReactLoading type={type} color={spinnerColor} height={height} width={width} />
        </div>
    )
};

PLSpinner.propTypes = {
    type: PropTypes.oneOf(["spin", "spokes", "spinningBubbles", "bars"]),
    color: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    style: PropTypes.object
};

PLSpinner.defaultProps = {
    type: "spinningBubbles",
    height: 100,
    width: 100
};

export default PLSpinner;