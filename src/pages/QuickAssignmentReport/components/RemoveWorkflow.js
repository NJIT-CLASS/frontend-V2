import React, { Component } from 'react';
import PLModal from "../../../shared/PLModal/PLModal";
import axios from 'axios'
import Typography from "@material-ui/core/Typography";
import Hr from "../../../shared/Hr/Hr";
import PLButton from "../../../shared/PLButton/PLButton";
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


// This component renders a popup message asking for confirmation when the user tries to remove
// problem threads. On confirmation, it performs the removal.
class RemoveWorkflow extends Component {

    cancelWorkflows() {
        // This function calls the backend API for cancelling (removing) workflows.
        // See the 'To Cancel Workflows' section of the 'Pool and Reallocation APIs' document
        // for information about this API call.
        // (https://drive.google.com/open?id=1IID3sbmgdTUW2X5E7Buve18UnDR3cM-k)

        // The API requires the submitted IDs to be Numbers to work properly so we have to
        // convert them from String to Number.
        const assignmentID = parseInt(this.props.assignmentID, 10);
        const workflowIDs = this.props.workflowIDs.map(id => parseInt(id, 10));

        const cancelWorkflowPostBody = {
            ai_id: assignmentID,
            wi_ids: workflowIDs
        };

        const cancelWorkflowURL = '/reallocate/cancel_workflows';
        // showMessage('Cancelling problem threads...');
        axios.post(cancelWorkflowURL, cancelWorkflowPostBody)
            .then(response => {
                // The API requires confirmation before it does the cancellation if the workflow
                // removals will result in students having an unequal number of tasks. We do the
                // confirmation immediately here, but in the future, we may want to display a message
                // to the user asking for further confirmation that they want to go through with this.
                const confirmCancelURL = '/reallocate/confirm_cancellation';
                const data = response.data;
                if (data.confirmation_required) {
                    const confirmCancelPostBody = {
                        data: data.data
                    };
                    return axios.post(confirmCancelURL, confirmCancelPostBody);
                } else {
                    return response;
                }
            }).then(() => {
                this.props.onWorkflowCancel();
                // showMessage('Problem threads successfully cancelled');
            });
        this.props.onClose();
    }

    render() {
        const {classes} = this.props;
        const title = 'Are you sure you want to remove these problem threads?';
        const okLabel = 'Remove problem threads';
        const cancelLabel = 'Don\'t remove problem threads';

        const workflowsToRemoveList = this.props.workflowIDs.length > 0 ?
            <ul>
                {this.props.workflowIDs.map(
                    workflowID => <li key={workflowID}>{`Problem thread: ${workflowID}`}</li>
                )}
            </ul>
            : <p>No problem threads selected</p>;

        const message =
            <div>
                <p>The following problem threads will be removed: </p>
                {workflowsToRemoveList}
                <p style={{fontSize: 'smaller'}}>
                    Note: Only problem threads that have not already started will be removed.
                </p>
            </div>;

        return (
            <PLModal
                open={this.props.open}
                close={this.props.onClose}
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
                            <PLButton onClick={() => this.cancelWorkflows()}>
                                {okLabel}
                            </PLButton>
                        </div>
                    </div>
                </div>
            </PLModal>
        );
    }
}

export default withStyles(styles)(RemoveWorkflow);
