import React from 'react';
import TaskComponent from './TaskComponent';
import Checkbox from "@material-ui/core/Checkbox";
import PLTooltip from "../../../shared/PLTooltip/PLTooltip";

// This component renders a workflow instance.
// It contains all of the workflow instance's task activities (each represented as a TaskComponent).
const WorkflowInstanceComponent = ({
   currentUserID,
   hasInstructorPrivilege,
   showAnonymousVersion,
   Workflow,
   Structure,
   WI_ID,
   WA_ID,
   Filters,
   Strings,
   onReplaceUserInTaskButtonClick,
   onMoreInformationButtonClick,
   showCheckboxes,
   onCheckboxClick,
   selectedWorkflowIDs,
   onBypassTaskButtonClick,
   onCancelTaskButtonClick,
   onRestartTaskButtonClick,
   index
}) => {
    let taskActivitiesArray = Object.keys(Workflow)
        .map(taskActivityID => (
            <TaskComponent
                TaskActivity={Workflow[taskActivityID]}
                TA_ID={taskActivityID}
                WI_ID={WI_ID}
                WA_ID={WA_ID}
                key={`${WA_ID}-${WI_ID}-${taskActivityID}`}
                Filters={Filters}
                Strings={Strings}
                onReplaceUserInTaskButtonClick={onReplaceUserInTaskButtonClick}
                onMoreInformationButtonClick={onMoreInformationButtonClick}
                hasInstructorPrivilege={hasInstructorPrivilege}
                showAnonymousVersion={showAnonymousVersion}
                currentUserID={currentUserID}
                onBypassTaskButtonClick={onBypassTaskButtonClick}
                onCancelTaskButtonClick={onCancelTaskButtonClick}
                onRestartTaskButtonClick={onRestartTaskButtonClick}
            />
        ));

    return (
        <div className="workflow-block">
            {showCheckboxes ? (
                /* Checkboxes for selecting workflows to cancel are shown next to the workflow instance.*/
                <Checkbox
                    checked={selectedWorkflowIDs.includes(WI_ID)}
                    onChange={() => onCheckboxClick(WI_ID)}
                    color={"primary"}
                />
            ) : null}
            <div className="workflow-instance-label">
                {/* This shows the workflow instance ID next to the workflow instance.
                 An explanatory tooltip is shown next to only the first workflow instance
                 (the one with index 0). */}
                {WI_ID} {index === 0 ? <PLTooltip text={Strings.WorkflowInstanceTooltip} margin={"0 0 0 2px"} /> : null}
            </div>
            <div className="workflow-instance">
                {taskActivitiesArray}
                <br />
                <br />
            </div>
        </div>
    );
};

export default WorkflowInstanceComponent;
