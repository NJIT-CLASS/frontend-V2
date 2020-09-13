import React, { Component } from 'react';
import PLSelect from "../../../shared/PLSelect/PLSelect";
import axios from "axios"
import MenuItem from "@material-ui/core/MenuItem";

class  SectionSelectComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            SectionList: []
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.CourseID !== '' && (this.props.CourseID !== prevProps.CourseID || this.props.SemesterID !== prevProps.SemesterID) ){
            const {UserID, SemesterID, CourseID} = this.props;

            axios.get(`/getCourseSections/${CourseID}?userID=${UserID}&semesterID=${SemesterID}`).then((response) => {
                const body = response.data;
                let sectionsList = body.Sections.map((section) => {
                    return {value: section.SectionID, label: section.Name};
                });

                this.setState({
                    SectionList: sectionsList
                });
            });
        }
    }


    render() {
        let {SectionList} = this.state;
        const {SectionID, Strings, onChange, name} = this.props;
        const placeholder = `${Strings.Section}...`;

        return (
            <PLSelect value={SectionID} placeholder={placeholder} onChange={onChange} name={name}>
                {SectionList.map((section) => {
                    return <MenuItem value={section.value} key={section.value}>{section.label}</MenuItem>
                })}
            </PLSelect>
        )
    }
}

export default SectionSelectComponent ;