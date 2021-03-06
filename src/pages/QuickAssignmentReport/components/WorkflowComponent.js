import React from 'react';
import WorkflowInstanceComponent from './WorkflowInstanceComponent';
import PLTooltip from "../../../shared/PLTooltip/PLTooltip";

// This component renders a workflow activity (ie a problem type).
// It contains all of the workflow activity's workflow instances (ie problem threads), each
// represented as a WorkflowInstanceComponent.
const WorkflowComponent = ({
   hasInstructorPrivilege,
   showAnonymousVersion,
   currentUserID,
   WorkflowInstances,
   Structure,
   WorkflowActivityName,
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
   numberOfProblemTypes
}) => {
    const workflowInstancesArray = Object.keys(WorkflowInstances)
        .filter(workflowInstanceID => {
            // We only show workflow instances that contain at least one task belonging to the current user
            // (unless the user has instructor privileges -- then they are allowed to see everything)
            if (hasInstructorPrivilege) {
                return true;
            }
            for (const [, taskActivity] of Object.entries(WorkflowInstances[workflowInstanceID])) {
                if (taskActivity.some(taskInstance => taskInstance.User.UserID === currentUserID)) {
                    return true;
                }
            }
            return false;
        })
        .map((workflowInstanceID, index) => {
            return (
                <WorkflowInstanceComponent
                    Workflow={WorkflowInstances[workflowInstanceID]}
                    Structure={Structure}
                    WI_ID={workflowInstanceID}
                    WA_ID={workflowInstanceID}
                    key={`${WA_ID}-${workflowInstanceID}`}
                    Filters={Filters}
                    Strings={Strings}
                    onReplaceUserInTaskButtonClick={
                        onReplaceUserInTaskButtonClick
                    }
                    onMoreInformationButtonClick={onMoreInformationButtonClick}
                    showCheckboxes={showCheckboxes}
                    onCheckboxClick={onCheckboxClick}
                    selectedWorkflowIDs={selectedWorkflowIDs}
                    hasInstructorPrivilege={hasInstructorPrivilege}
                    showAnonymousVersion={showAnonymousVersion}
                    currentUserID={currentUserID}
                    onBypassTaskButtonClick={onBypassTaskButtonClick}
                    onCancelTaskButtonClick={onCancelTaskButtonClick}
                    onRestartTaskButtonClick={onRestartTaskButtonClick}
                    index={index}
                />
            );
        });

    if (workflowInstancesArray.length > 0) {
        return (
            <div className="workflow-activity-block">
                <div className="workflow-activity-label">
                    <span style={{fontSize: '20px'}}>{WA_ID} - {WorkflowActivityName}</span>
                    <PLTooltip text={numberOfProblemTypes > 1
                        ? Strings.WorkflowActivityMultipleProblemTooltip
                        : Strings.WorkflowActivitySingleProblemTooltip} ID={WA_ID} />
                </div>
                {workflowInstancesArray}
            </div>
        );
    } else {
        return null;
    }
};

export default WorkflowComponent;
