import React from "react";
import axios from "axios"
import {flatten, uniqBy, flatMap, sortBy, findIndex, remove} from 'lodash';
import {withRouter} from "react-router-dom"

import withSignedInSkeleton from "../../HOC/withSignedInSkeleton/withSignedInSkeleton";

import PLSpinner from "../../shared/PLSpinner/PLSpinner";
import PLButton from "../../shared/PLButton/PLButton";
import PLTooltip from "../../shared/PLTooltip/PLTooltip";
import PLToggleSwitch from "../../shared/PLToggleSwitch/PLToggleSwitch";

import FilterSection from "./components/FilterSection";
import LegendSection from "./components/LegendSection";
import AssignmentComponent from "./components/AssignmentComponent";
import TaskReallocationForm from "./components/TaskReallocationForm";
import MoreInformation from "./components/MoreInfromation";
import RemoveWorkflow from "./components/RemoveWorkflow";
import BypassTask from "./components/BypassTask";
import CancelTask from "./components/CancelTask";
import RestartTask from "./components/RestartTask";
import AssignmentReallocationForm from './components/AssignmentReallocationForm'

import strings from "./strings";
import "./QuickAssignmentReport.scss"

class QuickAssignmentReport extends React.PureComponent{

    constructor(props) {
        super(props);

        this.state = {
            AssignmentData: {},
            AssignmentDataLoaded: false,
            Filters: { ProblemType: '', TaskType: [], Status: [], Users: [] },
            Strings: strings,
            sectionInfo: null,
            sectionInfoLoaded: false,
            taskActivities: [], // List of info for each task activity. Used by the task type filter in the FilterSection component.
            showAssignmentReallocationForm: false,
            showTaskReallocationForm: false,
            showMoreInformation: false,
            // When workflowCancellationMode is true, checkboxes appear next to each
            // workflow instance so that they can be selected for cancellation, the
            // hidden workflow cancellation buttons are revealed, and the 'replace in
            // assignment' button is hidden.
            workflowCancellationMode: false,
            selectedWorkflowIDs: new Set(),
            showRemoveWorkflowConfirmation: false,
            showBypassTaskConfirmation: false,
            showCancelTaskConfirmation: false,
            showRestartTaskConfirmation: false,
            showAnonymousVersion: false,
            AssignmentID: this.props.match.params.assignmentId
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        this.fetchAssignmentData();
        this.fetchSectionInfo().then(() => {});
    }

    fetchAssignmentData() {
        const url = `/getAssignmentReport/alternate/${this.state.AssignmentID}`;

        // this.props.__(strings, (newStrings) => {

        // });
        axios.get(url).then((response) => {
            const body = response.data;
            this.setState({
                AssignmentData: body.Result,
                // Strings: newStrings,
                AssignmentDataLoaded: true
            });
        });

        this.getTaskActivities(this.state.AssignmentID)
            .then(taskActivities => this.setState({taskActivities}));
    }

    async fetchSectionInfo() {
        /*
        Fetches all of the following data and combines them into the sectionInfo object:
            Assignment Name: shown at the top of the page.
            Section ID:      needed for the APIs to fetch everything else below.
            Volunteer IDs:   needed for the volunteer pool in the TaskReallocationForm and AssignmentReallocationForm components.
            Course Name:     shown at the top of the page.
            Course Number:   shown at the top of the page.
            Section Name:    shown at the top of the page.
            Semester Name:   shown at the top of the page.
            Users:           needed in many of the child components.
        */
        const {AssignmentID} = this.state;
        const {sectionID, assignmentName} = await this.getSectionIdAndAssignmentName(AssignmentID);
        const volunteerIDs = this.getVolunteerIds(sectionID);
        const names = this.getNames(sectionID); // courseName, courseNumber, sectionName, and semesterName
        const users = this.getUsers(sectionID);

        const sectionInfo = {
            sectionID,
            assignmentName,
            ...(await names),
            volunteerIDs: await volunteerIDs,
            users: await users,
        };

        this.setState({
            sectionInfo,
            sectionInfoLoaded: true,
        });
    }

    getTaskActivities(assignmentID) {
        const assignmentReportURL = `/getAssignmentReport/${assignmentID}`;
        return axios.get(assignmentReportURL).then((response) => {
            let taskActivities = flatMap(response.data.Result, (workflow) =>
                workflow.map(taskInstance => ({
                    taskActivityDisplayName: taskInstance.TaskActivity.DisplayName,
                    taskActivityID: taskInstance.TaskActivity.TaskActivityID,
                    workflowActivityName: taskInstance.WorkflowInstance.WorkflowActivity.Name,
                    workflowActivityID: taskInstance.WorkflowInstance.WorkflowActivityID
                })));
            taskActivities = uniqBy(taskActivities, 'taskActivityID'); // remove duplicates
            return sortBy(taskActivities, ['workflowActivitiyID', 'taskActivityID']);
        });
    }

    getVolunteerIds(sectionID) {
        const volunteersURL = `/VolunteerPool/VolunteersInSection/${sectionID}`;
        return axios.get(volunteersURL)
            .then(response => response.data.Volunteers.map(user => user.UserID))
            // The API call will fail if the logged in user is a student, in which case return an empty
            // list. (The volunteers are only needed by instructors/admins anyway, for reallocation.)
            .catch(() => []);
    }

    getNames(sectionID) {
        // Get the course name, course number, section name, and semester name of the section
        const sectionInfoURL = `/section/info/${sectionID}`;
        return axios.get(sectionInfoURL)
            .then(response => ({
                courseName: response.data.Section.Course.Name,
                courseNumber: response.data.Section.Course.Number,
                sectionName: response.data.Section.Name,
                semesterName: response.data.Section.Semester.Name,
            }));
    }

    getSectionIdAndAssignmentName(assignmentID) {
        const assignmentRecordURL = `/getAssignmentRecord/${assignmentID}`;
        return axios.get(assignmentRecordURL)
            .then(response => ({
                sectionID: response.data.Info.SectionID.SectionID,
                assignmentName: response.data.Info.SectionID.DisplayName
            }));
    }

    getUsers(sectionID){
        // Get all of the users in the section (students, instructors, and observers)
        const buildUser = user => ({
            id: user.UserID,
            active: user.Active,
            firstName: user.User.FirstName,
            lastName: user.User.LastName,
            role: user.Role,
            email: user.UserLogin.Email
        });

        const usersURL = `/sectionUsers/${sectionID}/`;
        return Promise.all(['Student', 'Instructor', 'Observer']
            .map(role =>
                axios.get(usersURL + role)
                    .then(response => response.data.SectionUsers.map(buildUser))
            )
        ).then(flatten); // return as a flat list of users rather than a list of lists.
    }


    changeFilterTaskType(event){
        this.setState((prevState) => {
            let newFilters = prevState.Filters;
            let newTaskFilters = event.target.value;
            const newAddedTaskFilter = newTaskFilters[newTaskFilters.length - 1];

            const index = findIndex(prevState.Filters.TaskType, (obj) => obj.label === newAddedTaskFilter.label);
            if(index > -1){
                newTaskFilters = remove(newTaskFilters, (ele) => ele.label !== newAddedTaskFilter.label)
            }

            newFilters.TaskType =  newTaskFilters;
            return {
                Filters: newFilters
            }
        });
    }

    changeFilterProblemType(event){
        let newFilters = this.state.Filters;
        newFilters.ProblemType = event.target.value;
        // The task type filter should only display tasks that belong to the selected problem type,
        // so since the problem type changed, we must reset the task type filter:
        newFilters.TaskType = [];
        this.setState({
            Filters: newFilters
        });
    }

    changeFilterStatus(event){
        this.setState((prevState) => {
            let newFilters = prevState.Filters;
            let newStatusFilters = event.target.value;
            const newAddedStatusFilter = newStatusFilters[newStatusFilters.length - 1];

            const index = findIndex(prevState.Filters.Status, (obj) => obj.label === newAddedStatusFilter.label);
            if(index > -1){
                newStatusFilters = remove(newStatusFilters, (ele) => ele.label !== newAddedStatusFilter.label)
            }

            newFilters.Status =  newStatusFilters;
            return {
                Filters: newFilters
            }
        });
    }

    changeFilterUsers(event){
        this.setState((prevState) => {
            let newFilters = prevState.Filters;
            let newUserFilters = event.target.value;
            const newAddedUserFilter = newUserFilters[newUserFilters.length - 1];

            const index = findIndex(prevState.Filters.Users, (obj) => obj.label === newAddedUserFilter.label);
            if(index > -1){
                newUserFilters = remove(newUserFilters, (ele) => ele.label !== newAddedUserFilter.label)
            }

            newFilters.Users =  newUserFilters;
            return {
                Filters: newFilters
            }
        });
    }

    handleReplaceUserInTaskButtonClick(clickedTaskInstance) {
        // Store the clicked task instance so that the 'replace user' form
        // knows which task to reallocate.
        this.clickedTaskInstance = clickedTaskInstance;
        this.setState({ showTaskReallocationForm: true });
    }

    handleMoreInformationButtonClick(clickedTaskInstance) {
        // Store the clicked task instance so that the 'more information'
        // modal knows which task to show information about.
        this.clickedTaskInstance = clickedTaskInstance;
        this.setState({ showMoreInformation: true });
    }

    handleWorkflowInstanceSelection(clickedWorkflowID) {
        // This is called when the checkbox next to a workflow instance is
        // checked/unchecked. We update the selectedWorkflowIDs accordingly.
        this.setState(prevState => {
            const selectedWorkflowIDs = new Set(prevState.selectedWorkflowIDs);
            if (selectedWorkflowIDs.has(clickedWorkflowID)) {
                selectedWorkflowIDs.delete(clickedWorkflowID);
            } else {
                selectedWorkflowIDs.add(clickedWorkflowID);
            }
            return { selectedWorkflowIDs: selectedWorkflowIDs };
        });
    }

    handleWorkflowCancel() {
        this.setState({
            workflowCancellationMode: false,
            selectedWorkflowIDs: new Set()
        });
        this.fetchData(); // fetch the updated data from the backend
    }

    handleBypassTaskButtonClick(clickedTaskInstance) {
        // Store the clicked task instance so that the 'bypass task'
        // confirmation popup knows which task to bypass.
        this.clickedTaskInstance = clickedTaskInstance;
        this.setState({ showBypassTaskConfirmation: true });
    }

    handleCancelTaskButtonClick(clickedTaskInstance) {
        // Store the clicked task instance so that the 'cancel task'
        // confirmation pop knows which task to cancel.
        this.clickedTaskInstance = clickedTaskInstance;
        this.setState({ showCancelTaskConfirmation: true });
    }

    handleRestartTaskButtonClick(clickedTaskInstance) {
        // Store the clicked task instance so that the 'restart task'
        // confirmation popup knows which task to restart.
        this.clickedTaskInstance = clickedTaskInstance;
        this.setState({ showRestartTaskConfirmation: true });
    }

    render() {
        let buttons = null;
        // When in 'workflow cancellation mode,' we show the buttons related to cancelling workflows.
        // Otherwise, we show the button for replacing users in the entire assignment, and the
        // button for removing problem threads (which enables workflow cancellation mode).
        if (this.state.workflowCancellationMode) {
            buttons =(
                <div style={{display: "flex", justifyContent: "flex-start"}}>
                    <div style={{marginRight: "5px"}}>
                        <PLButton
                            onClick={() => this.setState({showRemoveWorkflowConfirmation: true})}
                        >
                            Remove selected problem threads
                            <PLTooltip text={strings.RemoveSelectedProblemThreadsTooltip} style={{marginLeft: "5px"}}/>
                        </PLButton>
                    </div>
                    <div style={{marginRight: "5px"}}>
                        <PLButton
                            onClick={() => this.setState({workflowCancellationMode: false})}
                        >
                            Cancel problem thread removals
                        </PLButton>
                    </div>
                    <div style={{marginRight: "5px"}}>
                        <PLButton
                            onClick={() => this.setState({selectedWorkflowIDs: new Set()})}
                        >
                            Clear Selections
                        </PLButton>
                    </div>
                </div>
            );
        } else {
            buttons = (
                <div style={{display: "flex", justifyContent: "flex-start"}}>
                    <div style={{marginRight: "5px"}}>
                        <PLButton
                            onClick={() => this.setState({ showAssignmentReallocationForm: true })}
                            style={{ marginRight: '30px' }}
                        >
                            Remove and replace users in the entire assignment
                            <PLTooltip text={strings.ReplaceInAssignmentTooltip} margin={"5px"}/>
                        </PLButton>
                    </div>
                    <div style={{marginRight: "5px"}}>
                        <PLButton
                            onClick={() => this.setState({ workflowCancellationMode: true })}
                        >
                            Remove problem threads
                            <PLTooltip text={strings.RemoveProblemThreadsTooltip} margin={"5px"}/>
                        </PLButton>
                    </div>
                </div>
            );
        }

        // TODO: this.props.hasInstructorPrivilege look into this
        return (
            !this.state.AssignmentDataLoaded? <PLSpinner type={"spin"} width={100} height={100} style={{marginTop: "10%"}}/>: (
                <div className="quick-assignment-report">
                    {this.state.sectionInfoLoaded? (
                        <div className="details">
                            <div>
                                {`${this.state.sectionInfo.courseNumber} - 
                                  ${this.state.sectionInfo.courseName} - 
                                  ${this.state.sectionInfo.sectionName} - 
                                   ${this.state.sectionInfo.semesterName} - 
                                   ${this.state.sectionInfo.assignmentName}`
                                }
                                {
                                    (!this.props.hasInstructorPrivilege) ?
                                        <PLTooltip
                                            text={this.state.Strings.DescriptionTooltip}
                                        />
                                        : null
                                }
                            </div>
                        </div>
                    )
                    :null}
                    <div style={{marginLeft: "1rem"}}>
                        {this.props.hasInstructorPrivilege ? // Only instructors/admins should see the anonymous mode switch
                            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "230px"}}>
                                <label>Anonymous Version</label>
                                <PLToggleSwitch
                                    onChange={() => this.setState(prevState => ({
                                        showAnonymousVersion: !prevState.showAnonymousVersion
                                    }))}
                                />
                            </div>
                            : null
                        }
                        {this.props.hasInstructorPrivilege ? // Only instructors/admins should see the buttons
                            <div>
                                {buttons}
                            </div>
                            : null
                        }
                        <div style={{marginTop: "0.5rem"}}>
                            <div style={{marginBottom: "1.5rem"}}>
                                <FilterSection
                                    Filters={this.state.Filters}
                                    onChangeFilterProblemType={this.changeFilterProblemType.bind(this)}
                                    onChangeFilterStatus={this.changeFilterStatus.bind(this)}
                                    onChangeFilterTaskType={this.changeFilterTaskType.bind(this)}
                                    onChangeFilterUsers={this.changeFilterUsers.bind(this)}
                                    Strings={this.state.Strings}
                                    users={this.state.sectionInfoLoaded ? this.state.sectionInfo.users : []}
                                    taskActivities={this.state.taskActivities}
                                    hasInstructorPrivilege={this.props.hasInstructorPrivilege}
                                    showAnonymousVersion={this.state.showAnonymousVersion}
                                />
                            </div>

                            <LegendSection Strings={this.state.Strings} />

                            <AssignmentComponent
                                hasInstructorPrivilege={this.props.hasInstructorPrivilege}
                                showAnonymousVersion={this.state.showAnonymousVersion}
                                currentUserID={parseInt(this.props.UserID)}
                                Assignment={this.state.AssignmentData}
                                Filters={this.state.Filters}
                                Strings={this.state.Strings}
                                onReplaceUserInTaskButtonClick={clickedTaskInstance => this.handleReplaceUserInTaskButtonClick(clickedTaskInstance)}
                                onMoreInformationButtonClick={clickedTaskInstance => this.handleMoreInformationButtonClick(clickedTaskInstance)}
                                onBypassTaskButtonClick={clickedTaskInstance => this.handleBypassTaskButtonClick(clickedTaskInstance)}
                                onCancelTaskButtonClick={clickedTaskInstance => this.handleCancelTaskButtonClick(clickedTaskInstance)}
                                onRestartTaskButtonClick={clickedTaskInstance => this.handleRestartTaskButtonClick(clickedTaskInstance)}
                                onCheckboxClick={clickedWorkflowID => this.handleWorkflowInstanceSelection(clickedWorkflowID)}
                                showCheckboxes={this.state.workflowCancellationMode}
                                selectedWorkflowIDs={Array.from(this.state.selectedWorkflowIDs)}
                            />

                            {this.state.showTaskReallocationForm && this.state.sectionInfoLoaded ? (
                                <TaskReallocationForm
                                    onClose={() => this.setState({showTaskReallocationForm: false})}
                                    open={this.state.showTaskReallocationForm && this.state.sectionInfoLoaded}
                                    taskInstance={this.clickedTaskInstance}
                                    sectionInfo={this.state.sectionInfo}
                                    onUserReplaced={() => this.fetchData()}
                                />
                            ) : null}

                            {this.state.showAssignmentReallocationForm && this.state.sectionInfoLoaded ? (
                                <AssignmentReallocationForm
                                    open={this.state.showAssignmentReallocationForm}
                                    onClose={() =>
                                        this.setState({
                                            showAssignmentReallocationForm: false
                                        })
                                    }
                                    AssignmentID={this.props.AssignmentID}
                                    sectionInfo={this.state.sectionInfo}
                                    onUserReplaced={() => this.fetchData()}
                                />
                            ) : null}

                            {this.state.showMoreInformation ? (
                                <MoreInformation
                                    onClose={() => this.setState({ showMoreInformation: false })}
                                    open={this.state.showMoreInformation}
                                    taskInstance={this.clickedTaskInstance}
                                    sectionInfo={this.state.sectionInfo}
                                />
                            ) : null}

                            {this.state.showRemoveWorkflowConfirmation ? (
                                <RemoveWorkflow
                                    open={this.state.showRemoveWorkflowConfirmation}
                                    onClose={() => this.setState({ showRemoveWorkflowConfirmation: false })}
                                    workflowIDs={Array.from(this.state.selectedWorkflowIDs)}
                                    assignmentID={this.props.AssignmentID}
                                    onWorkflowCancel={() => this.handleWorkflowCancel()}
                                />
                            ) : null}

                            {this.state.showBypassTaskConfirmation ? (
                                <BypassTask
                                    open={this.state.showBypassTaskConfirmation}
                                    onClose={() => this.setState({ showBypassTaskConfirmation: false })}
                                    taskInstance={this.clickedTaskInstance}
                                    onBypassTask={() => this.fetchData()}
                                />
                            ) : null}

                            {this.state.showCancelTaskConfirmation ? (
                                <CancelTask
                                    open={this.state.showCancelTaskConfirmation}
                                    onClose={() => this.setState({ showCancelTaskConfirmation: false })}
                                    taskInstance={this.clickedTaskInstance}
                                    onCancelTask={() => this.fetchData()}
                                />
                            ) : null}

                            {this.state.showRestartTaskConfirmation ? (
                                <RestartTask
                                    open={this.state.showRestartTaskConfirmation}
                                    onClose={() => this.setState({ showRestartTaskConfirmation: false })}
                                    taskInstance={this.clickedTaskInstance}
                                    onRestartTask={() => this.fetchData()}
                                />
                            ) : null}

                        </div>
                    </div>
                </div>
            )
        );
    }
}

export default withRouter(withSignedInSkeleton(QuickAssignmentReport, "QuickAssignmentReport"));