import React, { Component } from 'react'; //import the React library and the Component class from the react package
import axios from 'axios';
import PLModal from "../../../shared/PLModal/PLModal";
import PLTable from "../../../shared/PLTable/PLTable";
import PLButton from "../../../shared/PLButton/PLButton";
import ToggleInstructorVolunteerComponent from './ToggleInstructorVolunteerComponent';
import ToggleInstructorGlobalVolunteerComponent from './ToggleInstructorGlobalVolunteerComponent';
import Typography from "@material-ui/core/Typography";

class InstructorVolunteerComponent extends Component { //create a class for the component
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            Tasks:[],
            Volunteer: false,
        };
    }
    componentDidMount() {
        this.fetchTasks(this.props.UserID, this.props.SectionID);
        console.log('Instructor volunteer component user ID ', this.props.UserID, this.props.FirstName, this.props.LastName, 'section ID ', this.props.SectionID);
        if (this.getQS('user') === this.props.UserID) {
            this.openModal();
        }
    }

    fetchTasks(userId, sectionId){
        axios.get(`/VolunteerPool/${userId}/${sectionId}/${false}`).then((response) => {
            const body = response.data;
            if(!body.Error){
                this.setState({Tasks: body.Volunteers})
            }
        });
        this.GlobalUpdate();
    }

    Update() {
        this.fetchTasks(this.props.UserID, this.props.SectionID);
        console.log('instructorVolunteerComponent update was called');
    }

    GlobalUpdate(){
        axios.get(`/SectionUsers/Volunteer/${this.props.UserID}/${this.props.SectionID}/${false}`).then((response)=> {
            const body = response.data;
            if(body.Message === 'Success'){
                this.setState({GlobalVolunteer: body.Volunteer});
                console.log(body.Volunteer);
            }
        });
    }

    openModal(){
        this.setState({open: true});
    }

    closeModal(){
        this.setState({open: false});
    }

    getQS(field) {
        let url = window.location.href;
        let regex = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
        let string = regex.exec(url);
        return string ? string[1] : null;
    }

    render() {
        let strings = {
            Assignment: 'Assignment',
            Status: 'Status',
            Volunteer: 'Volunteer?',
            NoTasks: 'There are no assignments to display',
            SelectText: 'Select a course/section',
            VolunteerSelected: 'Volunteer for selected assignments in this section',
            ViewText: 'View'
        };
        let {Tasks} = this.state;
        console.log(this.state.Tasks);

        return (
            <div>
                <PLButton onClick={this.openModal.bind(this)}>{strings.ViewText}</PLButton>
                <PLModal open={this.state.open} onClose={this.closeModal.bind(this)}>
                    <div className="section card-2 sectionTable">
                        <h2 className="title">{this.props.FirstName.concat(' ').concat(this.props.LastName)}</h2><br />
                        <div className="section-content" style={{minHeight: 150}}>
                            <Typography>{this.props.Email}</Typography>
                            <ToggleInstructorGlobalVolunteerComponent
                                Status={this.state.GlobalVolunteer}
                                UserID={this.props.UserID}
                                SectionID={this.props.SectionID}
                                Update={() => this.Update()}
                            />
                            {(this.state.GlobalVolunteer !== 'Approved' && this.state.GlobalVolunteer !== 'Pending' && this.state.GlobalVolunteer !== 'Appointed') &&
                            (<div>
                                <Typography>{strings.VolunteerSelected}</Typography>
                                <PLTable
                                    data={Tasks}
                                    // style={{overflow: 'visible'}}
                                    columns={[
                                        {
                                            Header: strings.Assignment,
                                            accessor: (row) => row.DisplayName,
                                            id: 'DisplayName',

                                        },
                                        {
                                            Header: strings.Status,
                                            accessor: (row) => row.AssignmentInstanceID,
                                            Cell: ({row}) => {
                                                console.log(row.original);
                                                return (
                                                    <div>
                                                        <ToggleInstructorVolunteerComponent
                                                            AssignmentInstanceID={row.original.AssignmentInstanceID}
                                                            UserID={this.props.UserID}
                                                            SectionID={this.props.SectionID}
                                                            Volunteer={(row.original.Status != null)}
                                                            VolunteerPoolID={row.original.VolunteerPoolID}
                                                            Update={() => this.Update()}
                                                            Status={row.original.Status}
                                                        />
                                                    </div>
                                                )
                                            },
                                            maxWidth: 120,
                                            id: 'AssignmentInstanceID'
                                        },
                                    ]}
                                    noDataText={strings.NoTasks}
                                />
                            </div>)}
                        </div>
                    </div>
                </PLModal>
            </div>
        );
    }
}
export default InstructorVolunteerComponent;
