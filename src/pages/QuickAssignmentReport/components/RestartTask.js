import React, { Component } from 'react';
import PLModal from "../../../shared/PLModal/PLModal";
import PLButton from "../../../shared/PLButton/PLButton";
import Hr from "../../../shared/Hr/Hr";
import axios from "axios"
import {withStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const styles = {
    formButtonsContainer: {
        display: 'flex',
        justifyContent: 'flex-start'
    },

    formButtonContainer: {
        marginRight: "0.75rem"
    }
};

// This component renders a popup message asking for confirmation when a user tries to restart a task.
// On confirmation, it should perform the restart.
// TODO: This still must be implemented.
class RestartTask extends Component {

    restartTask() {
        /* TODO: Implement this when the backend API is ready.*/
        const taskInstanceID = this.props.taskInstance.TaskInstanceID;
        const postBody = {
            ti_id: `${taskInstanceID}`,
            keep_content: 'false',
            duration: '[]'
        };

        const url = '/task/reset';

        axios.post(url, postBody)
            .then(() => {
                // showMessage('Task successfully restarted');
                this.props.onRestartTask();
            });

        this.props.onClose();
    }

    render() {
        const {classes} = this.props;
        const title = 'Are you sure you want to restart this task?';
        const okLabel = 'Restart this task';
        const cancelLabel = 'Don\'t restart this task';

        const taskID = this.props.taskInstance.TaskInstanceID;
        const taskName = this.props.taskInstance.TaskActivity.DisplayName;

        const message =
            <div>
                {/* TODO: remove this message when implemented */}
                <p>The following task will be restarted: </p>
                <ul>
                    <li>
                        {`${taskName} (ID: ${taskID})`}
                    </li>
                </ul>
            </div>;

        return (
            <PLModal
                open={this.props.open}
                onClose={this.props.onClose}
            >
                <Typography variant={"h5"} gutterBottom={true}>{title}</Typography>
                <Hr />
                <div id="modal-text">{message}</div>
                <div id="modal-footer">
                    <div className={classes.formButtonsContainer} >
                        <div className={classes.formButtonContainer}>
                            <PLButton onClick={this.props.onClose}>
                                {cancelLabel}
                            </PLButton>
                        </div>
                        <div className={classes.formButtonContainer}>
                            <PLButton onClick={() => this.restartTask()}>
                                {okLabel}
                            </PLButton>
                        </div>
                    </div>
                </div>
            </PLModal>
        );
    }
}

export default withStyles(styles)(RestartTask);
