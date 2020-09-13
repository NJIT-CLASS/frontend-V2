import React, { Component } from 'react';
import CollapsableBlock from './CollapsableBlock';
import UserList from './UserList';
import PLTooltip from "../../../shared/PLTooltip/PLTooltip";

import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";


// This component renders a form section for choosing a fallback replacement user.
// Used by TaskReallocationForm and AssignmentReallocationForm.
class FallbackReplacementSection extends Component {
    render() {
        const tooltip = 'The fallback replacement user will be the replacement if none of the users in the pools above satisfy the problem constraints.';
        return (
            <div>
                <Typography>How should the fallback replacement user be chosen?<PLTooltip text={tooltip} /></Typography>
                <FormControl component="fieldset">
                    <RadioGroup value={String(this.props.useDefaultFallback && !this.props.mustSpecifyFallback)} onChange={this.props.onUseDefaultFallbackChange}>
                        <FormControlLabel value={"true"} disabled={this.props.mustSpecifyFallback} control={<Radio color={"primary"} />} label="Use any instructor as the fallback replacement" />
                        <FormControlLabel value={"false"} disabled={this.props.mustSpecifyFallback} control={<Radio color={"primary"} />} label="Choose a specific fallback replacement" />
                    </RadioGroup>
                </FormControl>

                {!this.props.useDefaultFallback || this.props.mustSpecifyFallback ? (
                    <CollapsableBlock Title="Choose a fallback replacement user">
                        <UserList
                            users={this.props.users}
                            selectType="radio"
                            defaultSelection={this.props.fallbackID}
                            onSelectionChange={this.props.onFallbackChange}
                            isDisabled={user => user.selectedForRemoval}
                        />
                    </CollapsableBlock>
                ) : null}
            </div>
        );
    }
}

export default FallbackReplacementSection;
