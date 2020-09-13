import React, { Component } from 'react';
import PLTooltip from "../../../shared/PLTooltip/PLTooltip";
import PLInput from "../../../shared/PLInput/PLInput";

class TaskDisplayName extends Component {

    constructor(props) {
        super(props);
        this.changeInput = this.props.callTaskFunction.bind(this, 'changeInputData', 'TA_display_name', this.props.index, this.props.workflowIndex);
    }

    render() {
        let {strings, value} = this.props;
        return (
            <div className="inner">
                <label>{strings.DisplayName}</label>
                <PLTooltip Text={strings.TaskDisplayName} />
                <br />
                <PLInput
                    placeholder={strings.DisplayName}
                    value={value}
                    onChange={this.changeInput}
                />
                <br />
            </div>
        );
    }
}

export default TaskDisplayName;