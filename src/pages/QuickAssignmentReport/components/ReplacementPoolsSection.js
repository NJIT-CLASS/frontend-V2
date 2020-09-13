import React from "react";
import PLTooltip from "../../../shared/PLTooltip/PLTooltip";
import { cloneDeep } from 'lodash';
import UserList from './UserList';
import UserPoolList from './UserPoolList';
import CollapsableBlock from './CollapsableBlock'
import Typography from "@material-ui/core/Typography";

const ReplacementPoolsSection = (props) => {
    const tooltipText =
        `A replacement user that satisfies the problem constraints will be selected from one of the pools below.
            Click and drag to change the order in which the pools are tried.
            Use the checkboxes to enable and disable pools from being used.`;

    const handleSelectedAsReplacementChange = (changedUserID) => {
        // This function toggles a user's selectedAsReplacement property when it is selected/deselected.
        const users = cloneDeep(props.users);
        const changedUser = users.find(user => user.id === changedUserID);
        changedUser.selectedAsReplacement = !changedUser.selectedAsReplacement;

        // Update the users list in the parent component.
        props.onUsersChange(users);
    };

    return (
        <React.Fragment>

            <Typography>
                Replacement users will be picked in the following order:<PLTooltip text={tooltipText} placement={"bottom"}/>
            </Typography>

            <UserPoolList
                onChange={props.onPoolChange}
                pools={props.replacementPools}
            />

            {/* If the 'Specific Users' pool is enabled, reveal a user list for selecting new
                    candidate replacement users. */}
            {props.replacementPools.find(pool => pool.id === 'specific').enabled ? (
                <CollapsableBlock Title="Choose specific replacement users">
                    <UserList
                        users={props.users}
                        selectType={"checkbox"}
                        onSelectionChange={changedUserID => handleSelectedAsReplacementChange(changedUserID)}
                        isSelected={user => user.selectedAsReplacement}
                        // Users that are selected for removal cannot also be replacements, so we
                        // disable their checkboxes/radio buttons to disqualify them from selection
                        isDisabled={user => user.selectedForRemoval}
                    />
                </CollapsableBlock>
            ) : null}
        </React.Fragment>
    )

};

export default ReplacementPoolsSection;
