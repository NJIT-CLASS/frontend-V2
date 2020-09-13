import React, { Component } from 'react';
import axios from "axios"
import MenuItem from "@material-ui/core/MenuItem";
import PLSelect from "../../../shared/PLSelect/PLSelect";

class SemesterSelectComponent extends Component {
    constructor(props) {
        super(props);

        this.state= {
            SemesterList: []
        };

    }

    componentDidMount() {
        axios.get('/semester').then((response) => {
            const body = response.data;
            let SemestersArray = body.Semesters.map(function(Semester) {
                return ({value: Semester.SemesterID, label: Semester.Name});
            });
            this.setState({
                SemesterList: SemestersArray
            });
        });

    }

    render() {
        let {SemesterList} = this.state;
        const placeholder = `${this.props.Strings.Semester}...`;

        return (
            <PLSelect placeholder={placeholder}  onChange={this.props.onChange} value={this.props.SemesterID} name={this.props.name}>
                {SemesterList.map((semester) => {
                    return <MenuItem value={semester.value} key={semester.value}>{semester.label}</MenuItem>
                })}
            </PLSelect>
        )
    }
}

export default SemesterSelectComponent ;