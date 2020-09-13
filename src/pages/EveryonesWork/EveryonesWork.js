import React, { Component } from 'react';
import withSignedInSkeleton from "../../HOC/withSignedInSkeleton/withSignedInSkeleton";
import EveryonesWorkContainer from './components/EveryonesWorkContainer';
import CourseSelectComponent from './components/CourseSelect';
import SectionSelectComponent from './components/SectionSelect';
import AssignmentSelectComponent from './components/AssignmentSelect';
import SemesterSelectComponent from './components/SemesterSelect';
import TreeComponent from "./components/TreeComponent";

import FormGroup from "@material-ui/core/FormGroup";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import strings from "./strings";

class EveryonesWork extends Component {
    constructor(props) {
        super(props);

        this.state= {
            AssignmentID: ``,
            CourseID: ``,
            SectionID: ``,
            SemesterID: ``,
            WorkflowID: ``,
        };

    }

    componentDidMount() {
        // this.props.__(this.state.Strings, newStrings => {
        //     this.setState({Strings: newStrings});
        // });
    }

    selectOnChangeListener(event){
        this.setState({
            [event.target.name]: event.target.value,
            WorkflowID: ""
        })
    }

    semesterOnChangeListener(event){
        this.setState({
            [event.target.name]: event.target.value,
            SectionID: '',
            CourseID: '',
            WorkflowID: '',
            AssignmentID: '',
        })
    }

    courseOnChangeListener(event){
        this.setState({
            [event.target.name]: event.target.value,
            SectionID: ``,
            WorkflowID: '',
            AssignmentID: '',
        })
    }

    sectionOnChangeListener(event){
        this.setState({
            [event.target.name]: event.target.value,
            WorkflowID: '',
            AssignmentID: '',
        })
    }

    selectWorkflow(WorkflowID) {
        this.setState({ WorkflowID });
    }

    unselectWorkflow() {
        this.setState({
            WorkflowID: ""
        });
    }

    render() {
        const Strings = strings;
        let {AssignmentID, CourseID, SemesterID, SectionID} = this.state;
        let everyonesWorkSection = null;
        if(AssignmentID !== '') {
            if (this.state.WorkflowID !== '') {
                everyonesWorkSection = <div style={{paddingLeft: "10px"}}>
                    <Button style={{marginBottom: '1rem'}} color={"primary"} variant="contained" onClick={this.unselectWorkflow.bind(this)}>Back</Button>
                    <Typography variant={"h6"} gutterBottom>Assignment Tree</Typography>
                    <TreeComponent
                        UserID={this.props.UserID}
                        AssignmentID={AssignmentID}
                        WorkflowID={this.state.WorkflowID}
                    />
                </div>;
            } else {
                everyonesWorkSection = (
                    <EveryonesWorkContainer
                        UserID={this.props.UserID}
                        AssignmentID={AssignmentID}
                        selectWorkflow={this.selectWorkflow.bind(this)}
                    />
                );
            }
        }

        return (
            <Container>
                <FormGroup>
                    <SemesterSelectComponent
                        onChange={this.semesterOnChangeListener.bind(this)}
                        SemesterID={SemesterID}
                        Strings={Strings}
                        name={"SemesterID"}
                    />

                    <CourseSelectComponent
                        onChange={this.courseOnChangeListener.bind(this)}
                        UserID={this.props.UserID}
                        Strings={Strings}
                        CourseID={CourseID}
                        name={"CourseID"}
                    />
                    <SectionSelectComponent
                        onChange={this.sectionOnChangeListener.bind(this)}
                        UserID={this.props.UserID}
                        CourseID={CourseID}
                        SectionID={SectionID}
                        SemesterID={SemesterID}
                        Strings={Strings}
                        name={"SectionID"}
                    />
                    <AssignmentSelectComponent
                        onChange={this.selectOnChangeListener.bind(this)}
                        SectionID={SectionID}
                        AssignmentID={AssignmentID}
                        Strings={Strings}
                        name={"AssignmentID"}
                    />

                </FormGroup>
                {everyonesWorkSection}
            </Container>
        );
    }
}

export default withSignedInSkeleton(EveryonesWork, "EveryonesWork");