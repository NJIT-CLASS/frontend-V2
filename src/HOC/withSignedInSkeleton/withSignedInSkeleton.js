import React, {useCallback} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import {useDispatch, useSelector} from 'react-redux'

import PLSideDrawer from "../../shared/PLSideDrawer/PLSideDrawer";
import PLNavbar from "../../shared/PLNavbar/PLNavbar";

import * as actionTypes from "../../store/actions";

import routes from "../../routes/routes";
import shallowEqual from "react-redux/lib/utils/shallowEqual";
import makeNotification from "../../utils/NotificationFactory";


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },

    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));


let links = Object.values(routes).filter((link) => {
    return (link.template === true)
});


links = links.map((route) => {
    return {
        "icon": route.logo,
        "text": route.title,
        "to": route.path
    }
});


const withSignedInSkeleton = (WrappedPage, name) => {
    return (props) => {
        const classes = useStyles();
        const [open, setOpen] = React.useState(routes[name].sideBarOpen);
        const notification = useSelector(state => state.notification.notification, shallowEqual);
        const dispatch = useDispatch();


        const handleToggleOpen = () => {
            open ? setOpen(false): setOpen(true);
        };

        const clearNotification = useCallback(
            () => dispatch({type: actionTypes.CLEAR_NOTIFICATION}),
            [dispatch]
        );

        document.title = `${routes[name].title} | PL System`;

        return (
            <div className={classes.root}>
                <CssBaseline />
                <PLNavbar
                    expanded={open}
                    userName={"Zoraiz Naeem"}
                    pageName={routes[name].title}
                    handleToggleOpen={handleToggleOpen}
                    notification={notification}
                    clearNotification={clearNotification}
                />

                <PLSideDrawer
                    open={open}
                    links={links}
                />

                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <WrappedPage {...props} />
                </main>
            </div>
        );
    }
};

export default withSignedInSkeleton;
