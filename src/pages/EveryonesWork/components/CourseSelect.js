import React, { Component } from 'react';
import PLSelect from "../../../shared/PLSelect/PLSelect";
import axios from "axios"
import MenuItem from "@material-ui/core/MenuItem";

class CourseSelectComponent extends Component {
    constructor(props) {
        super(props);

        this.state= {
            CourseList: []
        };
    }

    componentDidMount() {
        axios.get(`/course/getCourses/${this.props.UserID}`).then((response) => {
            const body = response.data;
            let coursesArray = body.Courses.map(function(course) {
                return ({
                    value: course.CourseID,
                    label: course.Number + ' - ' + course.Name
                });
            });
            this.setState({
                CourseList: coursesArray
            });
        });
    }

    render() {
        let {CourseList} = this.state;
        const {Strings, name, onChange, CourseID} = this.props;
        const placeholder = `${Strings.Course}...`;
        return (
            <PLSelect placeholder={placeholder} onChange={onChange} value={CourseID} name={name}>
                {CourseList.map((course) => {
                    return <MenuItem value={course.value} key={course.value}>{course.label}</MenuItem>
                })}
            </PLSelect>
        )
    }
}

export default CourseSelectComponent;