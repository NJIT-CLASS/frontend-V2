import React from 'react';
import PLSelect from "../../../shared/PLSelect/PLSelect";
import {sortBy, uniqBy, findIndex} from 'lodash';
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";

// This component renders the filters on the Assignment Status page.
const FilterSection = ({
   hasInstructorPrivilege,
   Filters,
   onChangeFilterTaskType,
   onChangeFilterProblemType,
   onChangeFilterStatus,
   onChangeFilterUsers,
   Strings,
   users,
   taskActivities
}) => {

    // The problem type filter filters by workflow activity ID. It shows the workflow activity display names.
    let problemTypeOptions = taskActivities.map(ta => ({
        value: ta.workflowActivityID,
        label: ta.workflowActivityName
    }));

    problemTypeOptions = uniqBy(problemTypeOptions, 'value');
    const problemTypeFilter = problemTypeOptions.length >= 1 ? (
        <PLSelect
            onChange={onChangeFilterProblemType}
            value={Filters.ProblemType}
            placeholder={`${Strings.ProblemType} (${problemTypeOptions.length})`}
        >
            {problemTypeOptions.map((option) => {
                return <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
            })}

        </PLSelect>
    ) : null;

    // The task type filter filters by task activity ID and show the task activity display names. If there is more
    // than one problem type, it only shows the task activities that belong to the problem types selected in the
    // problem type filter. (The task type filter is disabled if there is more than one problem type and no problem
    // types are selected in the problem type filter. The user must select a problem type first.)

    const taskTypeOptions = taskActivities
        // .filter(ta => Filters.ProblemType == null || Filters.ProblemType.value === ta.workflowActivityID)
        .map(ta => ({
            value: ta.taskActivityID,
            label: ta.taskActivityDisplayName
        }));

    const taskTypeFilter = (
        <PLSelect
            onChange={onChangeFilterTaskType}
            value={Filters.TaskType}
            placeholder={Strings.TaskType}
            multiple={true}
            disabled={problemTypeOptions.length > 1 && Filters.ProblemType == null}
        >
            {taskTypeOptions.map((option) => {
                return (
                    <MenuItem value={option} key={option.value}>
                        <Checkbox checked={findIndex(Filters.TaskType, (o) => o.label === option.label) > -1} />
                        <ListItemText primary={option.label} />
                    </MenuItem>
                )
            })}
        </PLSelect>
    );


    // // The status filter filters by task status.
    const statusOptions = [
        {value: 'viewed', label: Strings.Viewed},
        {value: 'complete', label: Strings.Complete},
        {value: 'late', label: Strings.Late},
        {value: 'cancelled', label: Strings.Cancelled},
        {value: 'not_yet_started', label: Strings.NotYetStarted},
        {value: 'started', label: Strings.Started},
        {value: 'bypassed', label: Strings.Bypassed},
        {value: 'automatic', label: Strings.Automatic}
    ];
    const statusFilter = (
        <PLSelect
            onChange={onChangeFilterStatus}
            value={Filters.Status}
            multi={true}
            placeholder={'Status'}
            multiple
        >
            {statusOptions.map((option) => {
                return (
                    <MenuItem value={option} key={option.value}>
                        <Checkbox checked={findIndex(Filters.Status, (o) => o.label === option.label) > -1} />
                        <ListItemText primary={option.label} />
                    </MenuItem>
                )
            })}
        </PLSelect>
    );

    // The users filter filters by user ID. Only users with instructor privileges can see it.
    const userOptions = sortBy(users, user => user.id)
        .map(user => ({
            value: user.id,
            label: `${user.id} - ${user.email}`
        }));
    const userFilter = (
        hasInstructorPrivilege ?
            <PLSelect
                onChange={onChangeFilterUsers}
                value={Filters.Users}
                multi={true}
                placeholder={'User'}
                multiple
            >
                {userOptions.map((option) => {
                    return (
                        <MenuItem value={option} key={option.value}>
                            <Checkbox checked={findIndex(Filters.Users, (o) => o.label === option.label) > -1} />
                            <ListItemText primary={option.label} />
                        </MenuItem>
                    )
                })}
            </PLSelect>: null
    );

    return (
        <div style={{display: "flex", flexDirection: "row", maxHeight: "56px", zIndex: "100"}}>
            <div>
                {problemTypeFilter}
            </div>
            <div>
                {taskTypeFilter}
            </div>
            <div>
                {statusFilter}
            </div>
            <div>
                {userFilter}
            </div>
        </div>
    );

};

export default FilterSection;
