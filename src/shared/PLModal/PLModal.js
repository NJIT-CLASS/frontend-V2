import React from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import makeStyles from "@material-ui/core/styles/makeStyles";

const userStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    paper: (props) => ({
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        minWidth: props.minWidth
    }),
}));

const PLModal = (props) => {
    const classes = userStyles(props);
    const {open, onClose, children} = props;
    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            className={classes.modal}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <div style={{overflow: "auto", maxHeight: "90%"}}>
                <div className={classes.paper}>
                    {children}
                </div>
            </div>
        </Modal>

    )

};

PLModal.defaultProps = {
    minWidth: 680
};

export default PLModal;