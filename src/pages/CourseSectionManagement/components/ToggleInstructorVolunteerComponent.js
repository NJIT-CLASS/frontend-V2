import React, { Component } from 'react';
import axios from 'axios';
import PLSelect from "../../../shared/PLSelect/PLSelect";

//TODO Work on the Error on the Appointed Removed
class ToggleInstructorVolunteerComponent extends Component { //create a class for the component
    constructor(props) {
        super(props);
        this.state = {
            Tasks:[],
            Volunteer: this.props.Volunteer,
            VolunteerPoolID: (this.props.VolunteerPoolID != null) ? this.props.VolunteerPoolID : -1
        };
    }

    componentDidMount() {
        console.log('Mounting', this.state.VolunteerPoolID, this.props.VolunteerPoolID, this.props.AssignmentInstanceID);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.VolunteerPoolID !== this.state.VolunteerPoolID) {
            this.setState({VolunteerPoolID: nextProps.VolunteerPoolID})
        }
    }

    // toggleVolunteer(assignmentInstanceId){
    //     let postVars = {
    //         UserID: this.props.UserID,
    //         SectionID: this.props.SectionID,
    //         AssignmentInstanceID: assignmentInstanceId,
    //         //VolunteerPoolID: this.state.VolunteerPoolID,
    //     };
    //     console.log(this.props.AssignmentInstanceID, this.state.VolunnteerPoolID);
    //
    //     apiCall.post('/VolunteerPool/appoint', postVars, (err, res, body) => {
    //         console.log(res, body);
    //         this.props.Update();
    //     });
    // }

    handleAppoint() {
        const postData = {
            userId: this.props.UserID,
            SectionID: this.props.SectionID,
            AssignmentInstanceID: this.props.AssignmentInstanceID
        };

        axios.post('/VolunteerPool/appoint', postData).then(() => {
            this.props.Update();
        });
    }

    handleChangeStatus(event) {
        console.log('Event value - handling change', event.value);
        //if (event.value == 'Appointed') {
        //apiCall.post('/VolunteerPool/appoint', {UserID: this.props.UserID, SectionID: this.props.SectionID, AssignmentInstanceID: this.props.AssignmentInstanceID}, (err, res, body) => {
        //  console.log(res, body);
        //this.props.Update();
        //  });
        //}
        //else {
        const postData = {
            VolunteerPoolID: this.state.VolunteerPoolID,
            status: event.value
        };
        axios.post('/VolunteerPool/individualStatusUpdate', postData).then(() => {
            this.props.Update();
        });
        //}
    }

    render() {
        if (this.props.Status === 'Approved') {
            return (
                <PLSelect
                    options={[{label: 'Approved', value: 'Approved'}, {label: 'Removed', value: 'Removed'}]}
                    onChange={this.handleChangeStatus.bind(this)}
                    value={this.props.Status}
                    placeholder={'Select...'}
                />
            );
        }
        else if (this.props.Status === 'Appointed') {
            return (
                <PLSelect
                    options={[{label: 'Appointed', value: 'Appointed'}, {label: 'Removed', value: 'Removed'}]} onChange={this.handleChangeStatus.bind(this)}
                    value={this.props.Status}
                    placeholder={'Select...'}
                />
            );
        }
        else if (this.props.Status === 'Pending') {
            return (
                <PLSelect
                    options={[{label: 'Pending', value: 'Pending'}, {label: 'Approved', value: 'Approved'}, {label: 'Declined', value: 'Declined'}]} onChange={this.handleChangeStatus.bind(this)}
                    value={this.props.Status}
                    placeholder={'Select...'}
                />
            );
        }
        else if (this.props.Status === 'Removed') {
            return (
                <PLSelect
                    options={[{label: 'Removed', value: 'Removed'}, {label: 'Approved', value: 'Approved'}]} onChange={this.handleChangeStatus.bind(this)}
                    value={this.props.Status}
                    placeholder={'Select...'}
                />
            );
        }
        else if (this.props.Status === 'Declined') {
            return (
                <PLSelect
                    options={[{label: 'Declined', value: 'Declined'}, {label: 'Appointed', value: 'Appointed'}]} onChange={this.handleChangeStatus.bind(this)}
                    value={this.props.Status}
                    placeholder={'Select...'}
                />
            );
        }
        else {
            return (
                <PLSelect
                    options={[{label: 'Appointed', value: 'Appointed'}]} onChange={this.handleAppoint.bind(this)}
                    value={""}
                    placeholder={'Select...'}
                />
            );
        }
    }
}
export default ToggleInstructorVolunteerComponent;
