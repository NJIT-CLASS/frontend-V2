import React from 'react';
import WorkflowComponent from './WorkflowComponent';

// This component renders all of an assigment's workflow activities (ie problem types),
// each of which is represented as a WorkflowComponent.
const AssignmentComponent = ({
     currentUserID,
     hasInstructorPrivilege,
     showAnonymousVersion,
     Assignment,
     Filters,
     Strings,
     onReplaceUserInTaskButtonClick,
     onMoreInformationButtonClick,
     showCheckboxes,
     onCheckboxClick,
     selectedWorkflowIDs,
     onBypassTaskButtonClick,
     onCancelTaskButtonClick,
     onRestartTaskButtonClick
}) => {
    // Todo: Check this filtering
    const workflowsArray = Object.keys(Assignment)
        .filter(workflowActivityID => Filters.ProblemType === '' || Filters.ProblemType !== workflowActivityID)
        .map(workflowActivityID => (
            <WorkflowComponent
                WorkflowInstances={Assignment[workflowActivityID].WorkflowInstances}
                Structure={Assignment[workflowActivityID].Structure}
                WorkflowActivityName={Assignment[workflowActivityID].Name}
                WA_ID={workflowActivityID}
                key={workflowActivityID}
                Filters={Filters}
                Strings={Strings}
                onReplaceUserInTaskButtonClick={onReplaceUserInTaskButtonClick}
                onMoreInformationButtonClick={onMoreInformationButtonClick}
                showCheckboxes={showCheckboxes}
                onCheckboxClick={onCheckboxClick}
                selectedWorkflowIDs={selectedWorkflowIDs}
                currentUserID={currentUserID}
                hasInstructorPrivilege={hasInstructorPrivilege}
                showAnonymousVersion={showAnonymousVersion}
                onBypassTaskButtonClick={onBypassTaskButtonClick}
                onCancelTaskButtonClick={onCancelTaskButtonClick}
                onRestartTaskButtonClick={onRestartTaskButtonClick}
                numberOfProblemTypes={Object.keys(Assignment).length}
            />
        ));

    return <div>{workflowsArray}</div>;
};

export default AssignmentComponent;
