import clsx from "clsx";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types"

const useStyles = makeStyles((theme) => ({
    // appBarRoot: {
    //     justifyContent: "space-between",
    // },

    grow: {
        flexGrow: 1,
    },

    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        height: 65,
        marginLeft: theme.template.sideDrawerClosedWidth,
        width: `calc(100% - ${theme.template.sideDrawerClosedWidth}px)`,
    },
    appBarShift: {
        marginLeft: theme.template.sideDrawerOpenWidth,
        width: `calc(100% - ${theme.template.sideDrawerOpenWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },

}));

const PLNavbar = (props) => {
    const classes = useStyles(props);
    const {expanded, handleToggleOpen, userName, pageName} = props;
    return (
        <AppBar
            position="absolute"
            className={clsx(classes.appBar, {
                [classes.appBarShift]: expanded,
            })}

        >
            <Toolbar classes={{root: classes.appBarRoot}}>

                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleToggleOpen}
                        edge="start"
                        className={clsx(classes.menuButton)}
                    >
                        <Icon className={"fas fa-bars"}/>
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        {pageName}
                    </Typography>
                    <div className={classes.grow} />
                    <Typography variant="body2" noWrap>
                        {userName}
                    </Typography>

                    <Button style={{marginLeft: "5px"}}>
                        <Icon style={{fontSize: "20px", marginRight: "5px"}} className={"fas fa-sign-out-alt"} />
                        <Typography variant={"caption"} noWrap>
                            {"Logout"}
                        </Typography>
                    </Button>
            </Toolbar>
        </AppBar>
    )
};

PLNavbar.propTypes = {
  userName: PropTypes.string.isRequired,
  pageName: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired
};

export default PLNavbar