import React, { Component } from 'react';
import PLButton from "../../../shared/PLButton/PLButton";
import PLModal from "../../../shared/PLModal/PLModal";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import {withStyles} from "@material-ui/core/styles";

const styles = {
    formButtonsContainer: {
        display: 'flex',
        justifyContent: 'flex-start'
    },

    formButtonContainer: {
        marginRight: "0.75rem"
    }
};

// This component renders a popup message asking for confirmation when a user tries to cancel a task.
// On confirmation, it performs the cancellation.
class CancelTask extends Component {

    cancelTask() {
        // This function calls the backend API for cancelling a task.
        // See the 'Cancel a single task' section of the 'Pool and Reallocation APIs' document
        // for information about this API call.
        // (https://drive.google.com/open?id=1IID3sbmgdTUW2X5E7Buve18UnDR3cM-k)
        const taskInstanceID = this.props.taskInstance.TaskInstanceID;

        const postBody = {
            ti_id: taskInstanceID
        };

        const url = '/task/cancel';
        // showMessage('Cancelling the task...');
        axios.post(url, postBody)
            .then(() => {
                // showMessage('Task successfully cancelled');
                this.props.onCancelTask();
            });
        this.props.onClose();
    }

    render() {
        const {classes} = this.props;
        const title = 'Are you sure you want to cancel this task?';
        const okLabel = 'Cancel this task';
        const cancelLabel = 'Don\'t cancel this task';

        const taskID = this.props.taskInstance.TaskInstanceID;
        const taskName = this.props.taskInstance.TaskActivity.DisplayName;

        const message =
            <div>
                <p>The following task will be cancelled: </p>
                <ul>
                    <li>
                        {`${taskName} (ID: ${taskID})`}
                    </li>
                </ul>
                <p style={{fontSize: 'smaller'}}>
                    Note: Cancelling this task will stop all or part of the problem thread from continuing.
                </p>
            </div>;

        return (
            <PLModal
                open={this.props.open}
                onClose={this.props.onClose}
            >
                <Typography variant={"h5"} gutterBottom={true}>{title}</Typography>
                <div id="modal-text">{message}</div>
                <div id="modal-footer">
                    <div className={classes.formButtonsContainer} >
                        <div className={classes.formButtonContainer}>
                            <PLButton onClick={this.props.onClose}>
                                {cancelLabel}
                            </PLButton>
                        </div>
                        <div className={classes.formButtonContainer}>
                            <PLButton onClick={() => this.cancelTask()}>
                                {okLabel}
                            </PLButton>
                        </div>
                    </div>
                </div>
            </PLModal>
        );
    }
}

export default withStyles(styles)(CancelTask);
