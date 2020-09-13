import React, { Component } from 'react'; //import the React library and the Component class from the react package
import axios from 'axios';
import PLSelect from "../../../shared/PLSelect/PLSelect";
import Typography from "@material-ui/core/Typography";

class ToggleInstructorGlobalVolunteerComponent extends Component { //create a class for the component
    constructor(props) {
        super(props);
        this.state = {};
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.VolunteerPoolID !== this.state.VolunteerPoolID) {
            this.setState({VolunteerPoolID: nextProps.VolunteerPoolID})
        }
    }

    handleChangeStatus(status){
        axios.post(`/sectionUsers/changeVolunteer/${this.props.UserID}/${this.props.SectionID}/${status.value}/${'instructor'}`, null).then((res) => {
            if(res.status === 201){
                this.props.Update();
            }
        });
    }

    render() {
        let strings = {
            VolunteerAll: 'Volunteer for all assignments in this section'
        };

        if (this.props.Status === 'Approved') {
            return (
                <div>
                    <Typography>{strings.VolunteerAll}</Typography>
                    <PLSelect
                        options={[{label: 'Approved', value: 'Approved'}, {label: 'Removed', value: 'Removed'}]} onChange={this.handleChangeStatus.bind(this)}
                        value={this.props.Status}
                        placeholder={'Select...'}
                    />
                </div>
            );
        }
        else if (this.props.Status === 'Appointed') {
            return (
                <div>
                    <Typography>{strings.VolunteerAll}</Typography>
                    <PLSelect
                        options={[{label: 'Pending', value: 'Pending'}, {label: 'Approved', value: 'Approved'}, {label: 'Declined', value: 'Declined'}]} onChange={this.handleChangeStatus.bind(this)}
                        value={this.props.Status}
                        placeholder={'Select...'}
                    />
                </div>
            );
        }
        else if (this.props.Status === 'Pending') {
            return (
                <div>
                    <Typography>{strings.VolunteerAll}</Typography>
                    <PLSelect
                        options={[{label: 'Appointed', value: 'Appointed'}, {label: 'Removed', value: 'Removed'}]} onChange={this.handleChangeStatus.bind(this)}
                        value={this.props.Status}
                        placeholder={'Select...'}
                    />
                </div>
            );
        }
        else if (this.props.Status === 'Removed') {
            return (
                <div>
                    <Typography>{strings.VolunteerAll}</Typography>
                    <PLSelect
                        options={[{label: 'Removed', value: 'Removed'}, {label: 'Approved', value: 'Approved'}]} onChange={this.handleChangeStatus.bind(this)}
                        value={this.props.Status}
                        placeholder={'Select...'}
                    />
                </div>
            );
        }
        else if (this.props.Status === 'Declined') {
            return (
                <div>
                    <Typography>{strings.VolunteerAll}</Typography>
                    <PLSelect
                        options={[{label: 'Declined', value: 'Declined'}, {label: 'Appointed', value: 'Appointed'}]} onChange={this.handleChangeStatus.bind(this)}
                        value={this.props.Status}
                        placeholder={'Select...'}
                    />
                </div>
            );
        }
        else {
            return (
                <div>
                    <Typography>{strings.VolunteerAll}</Typography>
                    <PLSelect
                        options={[{label: 'Appointed', value: 'Appointed'}]} onChange={this.handleChangeStatus.bind(this)}
                        value={''}
                        placeholder={'Select...'}
                    />
                </div>
            );
        }
    }
}
export default ToggleInstructorGlobalVolunteerComponent;
