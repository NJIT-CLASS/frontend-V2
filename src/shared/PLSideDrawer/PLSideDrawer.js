import React from "react";
import clsx from "clsx";
import LogoBackground from "../../assests/images/logo_background.png";
import PropTypes from 'prop-types'
import { withRouter } from "react-router-dom";

import {makeStyles} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Icon from "@material-ui/core/Icon";
import List from "@material-ui/core/List";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import useTheme from "@material-ui/core/styles/useTheme";
import Typography from "@material-ui/core/Typography";


const useStyles = makeStyles((theme) => ({

    drawer: {
        width: theme.template.sideDrawerOpenWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },

    sideDrawerPaper: {
        backgroundColor: "#293847",
        borderColor: "#293847"
    },

    drawerIconRoot: {
        overflow: "visible"
    },

    drawerOpen: {
        width: theme.template.sideDrawerOpenWidth,
        transition: theme.transitions.create(['width', 'height'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
    },

    drawerClose: {
        transition: theme.transitions.create(['width', 'height'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.template.sideDrawerClosedWidth,
        [theme.breakpoints.up('sm')]: {
            width: theme.template.sideDrawerClosedWidth,
        },
        '& .MuiButtonBase-root':{
            maxHeight: 48
        }
    },

    logoHolder: {
        backgroundImage: `url(${LogoBackground})`,
        textAlign: "center",
        '& h2': {
            fontSize: 30,
            color: "#fff",
            margin: "1rem 0px",
            '& i': {
                display: "block",
                fontSize: 70,
                marginBottom: 5
            }
        },
    },

    logoHolderOpen: {

    },

    logoHolderClose: {
        '& h2': {
            '& i': {
                fontSize: 50,
            },
            '& span': {
                display: "none"
            }
        },
    },

    listItemSelected: {
        borderLeft: "4px solid",
        borderLeftColor: theme.palette.primary.main,
        backgroundColor: '#324455',
        "&:hover": {
            backgroundColor: "#324455",
        },
        "&:focus":{
            backgroundColor: "#324455",
        }
    },

    listItemRoot: {
        borderLeft: "4px solid #293847",
        backgroundColor: "#293847",
        "&:hover": {
            backgroundColor: "#324455",
            borderColor: "#324455"
        },
        "&:focus":{
            backgroundColor: "#324455",
            borderColor: "#324455"
        }
    },
}));

const PLSideDrawer = (props) => {
    const classes = useStyles(props);
    const theme = useTheme();
    const {open, history, location, links} = props;

    return (
        <Drawer
            variant="permanent"
            className={clsx( {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
            })}
            classes={{
                paper: clsx({
                    [classes.sideDrawerPaper]: true,
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                }),
            }}
        >
            <div className={clsx({
                    [classes.logoHolder]: true,
                    [classes.logoHolderOpen]: open,
                    [classes.logoHolderClose]: !open,
                })}
            >
                <h2>
                    <i className={theme.brandLogo.name}/>
                    <span>{theme.brandLogo.title}</span>
                </h2>
            </div>
            <List disablePadding>
                {links.map((link, index) => (
                    <ListItem
                        button
                        key={index}
                        classes={{root: clsx({
                            [classes.listItemSelected]: link.to === location.pathname,
                            [classes.listItemRoot]: !(link.to === location.pathname)
                        })}}
                        onClick={() => {
                            history.push(link.to)
                        }}
                    >
                        <ListItemIcon>
                            <Icon className={link.icon} classes={{root: classes.drawerIconRoot}} style={{color: "#fff", fontSize: theme.template.sideDrawerIconSize }} />
                        </ListItemIcon>
                        <ListItemText style={{color: "#fff"}}><Typography>{link.text}</Typography></ListItemText>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    )
};

PLSideDrawer.propTypes = {
    open: PropTypes.bool.isRequired,
};

PLSideDrawer.defaultProps = {
    links: []
};

export default withRouter(PLSideDrawer)