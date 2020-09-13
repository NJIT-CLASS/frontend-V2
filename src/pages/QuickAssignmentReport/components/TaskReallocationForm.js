import React, { Component } from 'react';
import axios from 'axios';

import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Typography from "@material-ui/core/Typography";
import {withStyles} from "@material-ui/core/styles";

import PLModal from "../../../shared/PLModal/PLModal";
import PLButton from "../../../shared/PLButton/PLButton";
import Hr from "../../../shared/Hr/Hr";

import FallbackReplacementSection from './FallbackReplacementSection';
import ReplacementPoolsSection from './ReplacementPoolsSection';
import ExtraCreditSection from "./ExtraCreditSection";

// This component renders the form for removing and replacing users in a single task or
// an entire workflow (ie problem thread).

const styles = {
    formButtonsContainer: {
        display: 'flex',
        justifyContent: 'flex-start'
    },

    formButtonContainer: {
       marginRight: "0.75rem"
    }
};



class TaskReallocationForm extends Component {
    constructor(props) {
        super(props);
        this.state = this.getDefaultState();
    }

    getDefaultState() {
        const currentlyAssignedUserID = this.props.taskInstance.User.UserID;

        // These new properties added to each user will allow for keeping track
        // of which user will be removed, and which users have been selected to be
        // a candidate replacement for the removed user. The user to be removed is
        // the user currently assigned to the task in question.
        const users = this.props.sectionInfo.users
            .map(user => ({
                ...user,
                selectedAsReplacement: false,
                selectedForRemoval: user.id === currentlyAssignedUserID
            }));

        // The fallback replacement is the user who will be the replacement if all other candidate replacements
        // don't satisfy the problem's constraints. By default, this user is an instructor.
        const defaultFallbackID = users.find(user => user.role === 'Instructor').id;

        // The user assigned to the task in question will be removed, so they cannot also be the fallback
        // replacement. The user using this form will have to specify a new fallback replacement.
        const mustSpecifyFallback = defaultFallbackID === currentlyAssignedUserID;

        return {
            users: users,

            extraCredit: true, // the replacement user will receive extra credit by default

            // 'ti' means "task instance," ie the user will be replaced only in this task instance by default.
            // Can also be "wi" for "workflow instance," ie the user will be replaced in the whole problem thread.
            // Don't rename these values -- they're used by the backend API.
            replaceUserIn: 'ti',

            fallbackID: defaultFallbackID,

            // Indicates whether or not the user using the form has chosen to use the default fallback replacement
            useDefaultFallback: true,

            // Indicates whether or not the instrutor using the form MUST manually specify the fallback replacement
            // (due to the current fallback replacement being invalid).
            // This property overrides useDefaultFallback if set to true.
            mustSpecifyFallback: mustSpecifyFallback,

            // Indicates the ordering of the replacement user pools and whether or not each one should be used.
            replacementPools: [
                {
                    id: 'volunteers',
                    displayName: 'Volunteer pool',
                    enabled: true
                },
                {
                    id: 'students',
                    displayName: 'All active students',
                    enabled: true
                },
                {
                    id: 'specific',
                    displayName: 'Specific users',
                    enabled: false
                }
            ],

            showConfirmationPopup: false
        };
    }

    handleSubmit() {
        this.setState({ showConfirmationPopup: true });
    }

    buildReplacementPoolsList() {
        // Builds a list containing each replacement user pool
        // (active students, volunteers, and specifically selected students).

        const activeStudentIDs = this.state.users
            .filter(user => user.active && user.role === 'Student')
            .map(user => user.id);

        const volunteerIDs = this.props.sectionInfo.volunteerIDs;

        // The IDs of the users who were specifically selected by the user using the form
        // to be candidate replacements.
        const specificReplacementUserIDs = this.state.users
            .filter(user => user.selectedAsReplacement && user.active)
            .map(user => user.id);

        const poolsList = this.state.replacementPools
            .filter(item => item.enabled)
            .map(item => {
                switch (item.id) {
                    case 'volunteers':
                        return volunteerIDs;
                    case 'specific':
                        return specificReplacementUserIDs;
                    case 'students':
                        return activeStudentIDs;
                    default:
                        return volunteerIDs;
                }
            });

        return poolsList;
    }

    // Todo: ShowMessage and test change user
    doReplace() {
        // Calls the backend API for replacing a user in a task or problem thread.
        // See the 'Automatically reallocate new user to this task instance' section of the
        // 'Pool and Reallocation APIs' document for information about this API call
        // (https://drive.google.com/open?id=1IID3sbmgdTUW2X5E7Buve18UnDR3cM-k)

        const currentlyAssignedUserID = this.props.taskInstance.User.UserID;
        if (this.state.fallbackID === currentlyAssignedUserID) {
            // showMessage('Error: Cannot remove the fallback replacement user. Select a different fallback.');
            return;
        }

        const taskInstanceID = this.props.taskInstance.TaskInstanceID;
        const postBody = {
            taskarray: [this.state.replaceUserIn, [taskInstanceID]],
            is_extra_credit: this.state.extraCredit,
            user_pool_wc: this.buildReplacementPoolsList(),
            user_pool_woc: [this.state.fallbackID]
        };

        const url = '/reallocate/task_based/';
        // showMessage('Replacing the user...');
        axios.post(url, postBody).then(() => {
            this.props.onUserReplaced();
            // showMessage('User successfully replaced');
        });

        this.props.onClose();
    }

    confirmationPopup() {
        const {classes} = this.props;
        const title = 'Are you sure you want to replace this user?';
        const okLabel = 'Replace this user';
        const cancelLabel = 'Don\'t replace this user';

        const taskInstance = this.props.taskInstance;
        const taskName = taskInstance.TaskActivity.DisplayName;
        const currentlyAssignedUserID = taskInstance.User.UserID;
        const firstName = taskInstance.User.FirstName;
        const lastName = taskInstance.User.LastName;

        const user = `${firstName} ${lastName} (ID: ${currentlyAssignedUserID})`;
        let message = null;
        if (this.state.replaceUserIn === 'ti') {
            message = (
                <span>
                    User {user} will be replaced in task '{taskName}'.
                </span>
            );
        } else {
            message = (
                <span>
                    User {user} will be replaced in task '{taskName}' and the rest of the problem thread.
                </span>
            );
        }

        return (
            <PLModal
                open={this.state.showConfirmationPopup}
                onClose={() => this.setState({ showConfirmationPopup: false })}
            >
                <Typography variant={"h5"} gutterBottom={true}>{title}</Typography>
                <Hr />
                <Typography>{message}</Typography>
                <br />
                <div className={classes.formButtonsContainer} >
                    <div className={classes.formButtonContainer}>
                        <PLButton onClick={() => this.setState({ showConfirmationPopup: false })}>
                            {cancelLabel}
                        </PLButton>
                    </div>
                    <div className={classes.formButtonContainer}>
                        <PLButton  onClick={() => this.doReplace()}>
                            {okLabel}
                        </PLButton>
                    </div>
                </div>
            </PLModal>
        );
    }

    render() {
        const {classes} = this.props;

        const replaceUserInSection = (
            <FormControl component="fieldset">
                <FormLabel component="legend" focused={false}>Replace this user:</FormLabel>
                <RadioGroup value={this.state.replaceUserIn} onChange={(_, value) => this.setState({ replaceUserIn: value })}>
                    <FormControlLabel value="ti" control={<Radio color={"primary"} />} label="In this task only" />
                    <FormControlLabel value="wi" control={<Radio color={"primary"} />} label="In the entire problem thread" />
                </RadioGroup>
            </FormControl>
        );


        const extraCreditSection = (
            <ExtraCreditSection
                extraCredit={this.state.extraCredit}
                onChange={(_, value) => this.setState({ extraCredit: value==='true' })}
            />
        );

        const replacementPoolsSection = (
            <ReplacementPoolsSection
                replacementPools={this.state.replacementPools}
                users={this.state.users}
                onUsersChange={(users) => this.setState({ users })}
                onPoolChange={replacementPools => this.setState({ replacementPools })}
            />
        );

        const fallbackReplacementSection = (
            <FallbackReplacementSection
                useDefaultFallback={this.state.useDefaultFallback}
                fallbackID={this.state.fallbackID}
                mustSpecifyFallback={this.state.mustSpecifyFallback}
                onFallbackChange={fallbackID => this.setState({ fallbackID })}
                onUseDefaultFallbackChange={(_, value) => this.setState({ useDefaultFallback: value==='true' })}
                users={this.state.users}
            />
        );

        const buttons = (
            <div className={classes.formButtonsContainer} >
                <div className={classes.formButtonContainer}>
                    <PLButton onClick={() => this.handleSubmit()}>
                        Replace User
                    </PLButton>
                </div>
                <div className={classes.formButtonContainer}>
                    <PLButton onClick={this.props.onClose}>
                        Cancel
                    </PLButton>
                </div>
                <div className={classes.formButtonContainer}>
                    <PLButton onClick={() => this.setState(this.getDefaultState())}>
                        Reset Form
                    </PLButton>
                </div>
            </div>
        );

        const taskInstance = this.props.taskInstance;
        const taskName = taskInstance.TaskActivity.DisplayName;
        const taskID = taskInstance.TaskInstanceID;
        const currentlyAssignedUserID = taskInstance.User.UserID;
        const currentlyAssignedUserEmail = taskInstance.User.UserContact.Email;
        return (
            <div>
                <PLModal
                    open={this.props.open}
                    onClose={this.props.onClose}
                >
                    <Typography variant={"h5"} gutterBottom={true}>Replace this user</Typography>
                    <Typography variant={"subtitle1"}><strong>User:</strong>{` ${currentlyAssignedUserEmail} (UserID: ${currentlyAssignedUserID})`}</Typography>
                    <Typography variant={"subtitle1"} gutterBottom={true}><strong>Task:</strong>{` ${taskName} (TaskID: ${taskID})`}</Typography>
                    <Hr />
                    {replaceUserInSection}
                    <Hr/>
                    {extraCreditSection}
                    <Hr/>
                    {replacementPoolsSection}
                    <Hr/>
                    {fallbackReplacementSection}
                    <br />
                    {buttons}
                </PLModal>
                {this.state.showConfirmationPopup
                    ? this.confirmationPopup()
                    : null}
            </div>
        );
    }
}

export default withStyles(styles)(TaskReallocationForm);
