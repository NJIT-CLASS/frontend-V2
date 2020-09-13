import React from 'react';
import Tooltip from "@material-ui/core/Tooltip";
import Icon from "@material-ui/core/Icon";
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    customWidth: props => ({
        maxWidth: props.width,
    }),
}));

// This PLTooltip wraps Material-UI PLTooltip component into an API, that is comparable to previous version
const PLTooltip = ({text, arrow, component, icon, placement, classes, size, style, margin,...props}) => {
    const style_classes = useStyles(props);
    return (
        <Tooltip title={text} arrow={arrow} placement={placement} classes={{tooltip: style_classes.customWidth, ...classes}}>
            {props.children ? props.children: (component ? component : <Icon className={icon} style={{fontSize: size, margin: margin, ...style, overflow: "visible"}}/>)}
        </Tooltip>
    )
};

PLTooltip.propTypes = {
    text: PropTypes.any.isRequired,
    arrow: PropTypes.bool,
    placement: PropTypes.oneOf(["bottom-start", "bottom", "bottom-end", "right-start", "right", "right-end",
        "top-start", "top", "top-end", "left-start", "left", "left-end"]),
    width: PropTypes.number,
    size: PropTypes.number,
    component: PropTypes.element,
    icon: PropTypes.string,
};

PLTooltip.defaultProps = {
    arrow: true,
    icon: "fa fa-info-circle PLTooltip-icon",
    placement: "bottom",
    width: 300,
    component: null,
    classes: {},
    size: 20,
    margin:  "0 5px 0 5px"
};

export default PLTooltip;
