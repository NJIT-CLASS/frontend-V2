import React, { Component } from 'react';
import PLSelect from "../../../shared/PLSelect/PLSelect";
import axios from 'axios';
import MenuItem from "@material-ui/core/MenuItem";

class AssignmentInstanceSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            AssignmentList: []
        };

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.SectionID !== '' && this.props.SectionID !== prevProps.SectionID){
            axios.get(`/getActiveAssignmentsForSection/${this.props.SectionID}`).then((response) => {
                if (response.status === 200) {
                    let assignmentList = response.data.Assignments.map((assignment) => {
                        return {value: assignment.AssignmentInstanceID, label: assignment.Assignment.DisplayName};
                    });

                    this.setState({
                        AssignmentList: assignmentList
                    });
                }
            });
        }
    }

    render() {
        const {AssignmentList} = this.state;
        const {Strings, AssignmentID, name, onChange} = this.props;
        const placeholder = `${Strings.Assignment}...`;
        return (
            <PLSelect value={AssignmentID} onChange={onChange} placeholder={placeholder} name={name}>
                {AssignmentList.map((assignment) => {
                    return <MenuItem value={assignment.value} key={assignment.value}>{assignment.label}</MenuItem>
                })}
            </PLSelect>
        );
    }
}

export default AssignmentInstanceSelect;