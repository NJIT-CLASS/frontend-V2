import React, { Component } from 'react';
import axios from "axios";
import {Link} from "react-router-dom";

class CoursesComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Courses: [],
        };
    }
    componentDidMount() {
        const userId = this.props.UserID;
        axios.get(`/course/getCourses/${userId}`).then((response) => {
            const {data} = response;
            this.setState({
                Courses: data.Courses
            });
        });
    }

    render() {
        let {Strings} = this.props;
        let {Courses} = this.state;
        let courseList = null;
        if(Courses.length > 0){
            courseList = Courses.map(course => {
                return <li key={course.CourseID} className="list-group-item">
                    <Link to={`/course_page/${course.CourseID}`}>{course.Number} {course.Name}</Link>
                </li>;
            });
        } else{
            courseList = <p>{Strings.NoCourses}</p>;
        }
        return (
            <div className="section card-2">
                <h2 className="title">{Strings.CurrentCourses}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        <ul className="list-group">
                            {courseList}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default CoursesComponent;