import React from 'react';

// TODO FIX TOGGLE GLOBAL VOLUNTEER COMPONENT

// important component cards for each entity type
import OrganizationManager from './components/OrganizationManager';
import CourseManager from './components/CourseManager';
import SemesterManager from './components/SemesterManager';
import SectionManager from './components/SectionManager';
import UserManager from './components/UserManager';

import withSignedInSkeleton from "../../HOC/withSignedInSkeleton/withSignedInSkeleton";

import strings from "./strings";
import "./CourseSectionManagment.scss"

// this container tracks the selected ID of each component card and makes them
// available to the others for conditional rendering and API calls
class CourseSectionManagement extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.strings = strings;
    }
    // uncomment this translation function when it is functional again
    componentDidMount() {
        // this.props.__(this.strings, (newStrings) => {
        //     this.setState({Strings: strings});
        // });
        this.setState({Strings: strings});
        this.switchTab();
    }
    // store selected organization ID to state, reset downstream IDs
    changeOrganizationID(organizationID) {
        this.setState({
            organizationID: organizationID,
            courseID: null,
            semesterID: null,
            sectionID: null
        });
    }
    // store selected course ID to state, reset downstream IDs
    changeCourseID(courseID) {
        this.setState({
            courseID: courseID,
            sectionID: null
        });
    }
    // store selected semester ID to state, reset downstream IDs
    changeSemesterID(semesterID) {
        this.setState({
            semesterID: semesterID,
            sectionID: null
        });
    }
    // store selected section ID to state
    changeSectionID(sectionID) {
        this.setState({
            sectionID: sectionID
        });
    }

    getQS(field) {
        let url = window.location.href;
        let regex = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
        let string = regex.exec(url);
        return string ? string[1] : null;
    }

    switchTab() {
        let org = this.getQS('org');
        let course = this.getQS('course');
        let semester = this.getQS('semester');
        let section = this.getQS('section');
        this.setState({
            organizationID: org,
            courseID: course,
            semesterID: semester,
            sectionID: section
        });
    }

    // render container with component cards
    // changeID function to send state back to parent
    // pass strings as props (all strings are declared in this file)
    // key is given because elements are being rendered as array (React requirement)
    render() {
        let output = [];
        output.push(
            <OrganizationManager
                key={1}
                changeID={this.changeOrganizationID.bind(this)}
                strings={this.strings}
                userID={this.props.UserID}
            />
        );
        if(this.state.organizationID) {
            output.push(
                <CourseManager
                    key={2}
                    changeID={this.changeCourseID.bind(this)}
                    strings={this.strings}
                    userID={this.props.UserID}
                    organizationID={this.state.organizationID}
                />
            );
            output.push(
                <SemesterManager
                    key={3}
                    changeID={this.changeSemesterID.bind(this)}
                    strings={this.strings}
                    userID={this.props.UserID}
                    organizationID={this.state.organizationID}
                />
            );
        }
        if(this.state.courseID && this.state.semesterID) {
            output.push(
                <SectionManager
                    key={4}
                    organizationID={this.state.organizationID}
                    changeID={this.changeSectionID.bind(this)}
                    strings={this.strings}
                    userID={this.props.UserID}
                    courseID={this.state.courseID}
                    semesterID={this.state.semesterID}
                    Tooltip={this.strings.observerToolTip}
                />
            );
        }
        // the next three components are all UserManagers
        // the only difference between student, insrtuctor, and observer is
        // the role prop (used in API calls) and the title prop (used in interface)
        if(this.state.sectionID) {
            output.push(
                <UserManager
                    key={5}
                    strings={this.strings}
                    userID={this.props.UserID}
                    sectionID={this.state.sectionID}
                    role="Student"
                    title={this.strings.students}
                    Tooltip = ""
                />
            );
            output.push(
                <UserManager
                    key={6}
                    strings={this.strings}
                    userID={this.props.UserID}
                    sectionID={this.state.sectionID}
                    role="Instructor"
                    title={this.strings.instructors}
                    Tooltip = ""
                />
            );
            output.push(
                <UserManager
                    key={7}
                    strings={this.strings}
                    userID={this.props.UserID}
                    sectionID={this.state.sectionID}
                    role="Observer"
                    title={this.strings.observers}
                    Tooltip={this.strings.observerToolTip}
                />
                // <Tooltip Text = { this.strings.observerToolTip} ID = { 'CM_noObservers_tooltip'}/>
            );
        }
        return (<div className={"main-container"}>{output}</div>);
    }
}

export default withSignedInSkeleton(CourseSectionManagement, "CourseSectionManagement");
