import React from 'react';
import axios from 'axios';
import parse from "csv-parse/lib/sync"

import InstructorVolunteerComponent from './InstructorVolunteerComponent.js';

import PLInput from "../../../shared/PLInput/PLInput";
import PLCheckbox from "../../../shared/PLCheckbox/PLCheckbox";
import PLSelect from "../../../shared/PLSelect/PLSelect";
import PLToggleSwitch from "../../../shared/PLToggleSwitch/PLToggleSwitch";
import PLTable from "../../../shared/PLTable/PLTable";
import PLTooltip from "../../../shared/PLTooltip/PLTooltip";
import PLButton from "../../../shared/PLButton/PLButton";
import PLSpinner from "../../../shared/PLSpinner/PLSpinner";

import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";


// simple React component to render individual section users as table rows
class User extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            Volunteer: this.props.volunteer,
            Status: this.props.status,
            VolunteerPoolID: this.props.VolunteerPoolID,
            Active: this.props.active
        };

        this.toggleStatus = this.toggleStatus.bind(this);
        this.toggleVolunteer = this.toggleVolunteer.bind(this);
        this.toggleActive = this.toggleActive.bind(this);
    }

    toggleVolunteer(){
        let postVars = {
            UserID: this.props.UserID,
            SectionID: this.props.SectionID,
        };
        let endpoint = '';
        if(this.props.VolunteerPoolID !== -1){
            endpoint = '/VolunteerPool/deleteVolunteer';
        } else {
            endpoint = '/VolunteerPool/add';
        }

        axios.post(endpoint, postVars).then((response) => {
            const body = response.data;
            if(response.status === 200){
                if(body){
                    this.setState({
                        Volunteer: true,
                        VolunteerPoolID: body.VolunteerPoolID
                    });
                } else {
                    this.setState({
                        Volunteer: false,
                        VolunteerPoolID: -1
                    });
                }
            }
        });
    }

    toggleActive(){
        let postVars = {
            active: !this.state.Active
        };
        let endpoint = `/sectionUsers/changeActive/${this.props.SectionUserID}`;

        axios.post(endpoint, postVars).then((response) => {
            if(response.status === 201){
                this.setState({
                    Active: !this.state.Active
                });
            }
        });
    }

    toggleStatus(option){
        let postVars = {
            VolunteerPoolID: this.state.VolunteerPoolID,
            status: option.value
        };
        let endpoint = '/VolunteerPool/individualStatusUpdate';

        axios.post(endpoint, postVars).then((response) => {
            if(response.status === 201){
                this.setState({
                    Status: postVars.status
                });
            }
        });
    }

    render() {
        //
        //	<td>{this.props.volunteer ? 'Yes' : 'No'}</td>
        let volunteerToggle = null;
        let statusToggle = null;
        let statusList = [{label:this.props.strings.Pending,value:'Pending'},{label:this.props.strings.Approved,value:'Approved'},{label:this.props.strings.Inactive,value:'Inactive'}];


        if(this.props.role === 'Student'){
            volunteerToggle = (<td>
                <PLToggleSwitch  checked={this.state.Volunteer} onChange={this.toggleVolunteer}/>
            </td>);

            if(this.state.Volunteer){
                statusToggle = (<td>
                    <PLSelect value={this.state.Status} onChange={this.toggleStatus}>
                        {statusList.map((status) => {
                            return <MenuItem value={status.value} key={status.value}>{status.label}</MenuItem>
                        })}
                    </PLSelect>
                </td>);
            } else {
                statusToggle = (<td>
                    <PLSelect className="small-select" disabled={true} options={statusList} value={""}>
                        {statusList.map((status) => {
                            return <MenuItem value={status.value} key={status.value}>{status.label}</MenuItem>
                        })}
                    </PLSelect>
                </td>);
            }
        }

        return (
            <tr>
                <td>{this.props.email}</td>
                <td>{this.props.firstName}</td>
                <td>{this.props.lastName}</td>
                <td>
                    <div style={{margin: '0 auto', width: 'fit-content'}}>
                        <PLToggleSwitch checked={this.state.Active} onChange={this.toggleActive} />
                    </div>
                </td>
                {this.state.Active && <InstructorVolunteerComponent UserID={this.props.UserID} SectionID={this.props.SectionID} FirstName={this.props.firstName} LastName={this.props.lastName} Email={this.props.email}/>}
                {(this.props.role === 'Student' && this.state.Active) && <td>{this.props.volunteer}</td>}
            </tr>
        );
    }
}

class UserManager extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            modeCSV: true,
            active: true,
            volunteer: false,
            headers: 1,
            loading: true
        };
    }
    // load all section users when section is selected in parent
    componentDidMount() {
        this.fetchAll(this.props.sectionID);
    }
    // reload section users when selected section changes in parent
    UNSAFE_componentWillReceiveProps(props) {
        if (this.props.sectionID !== props.sectionID) {
            this.fetchAll(props.sectionID);
        }
    }
    // get all section users of specified role for selected section
    // role is passed as prop to this component, used in API URL
    // store users in array of objects in state
    fetchAll(sectionID) {

        axios.get(`/sectionUsers/${sectionID}/${this.props.role}`).then((response) => {
            const body = response.data;
            let users = [];
            for (let user of body.SectionUsers) {
                users.push({
                    id: user.UserID,
                    active: user.Active,
                    volunteer: user.Volunteer,
                    firstName: user.User.FirstName,
                    lastName: user.User.LastName,
                    email: user.UserLogin.Email,
                    status: user.Status,
                    sectionUserId: user.SectionUserID,
                    volunteerId: user.User.VolunteerPools.length !== 0 ? user.User.VolunteerPools[0].VolunteerPoolID : -1
                });
            }
            this.setState({
                users: users,
                creating: false,
                editing: false,
                active: true,
                volunteer: false,
                errors: null,
                loading: false
            });
        });
    }
    // next five functions are to store state of form inputs
    changeEmail(event) {
        this.setState({
            email: event.target.value
        });
    }
    changeFirstName(event) {
        this.setState({
            firstName: event.target.value
        });
    }
    changeLastName(event) {
        this.setState({
            lastName: event.target.value
        });
    }
    changeActive() {
        this.setState({
            active: !this.state.active
        });
    }
    changeVolunteer() {
        this.setState({
            volunteer: !this.state.volunteer
        });
    }
    // change form mode between csv and single form
    changeEntryMode(option) {
        let mode = option.value === 'csv';
        if (mode !== this.state.modeCSV) {
            this.setState({
                modeCSV: mode,
                errors: null
            });
        }
    }
    // change header ordering for CSV input
    changeHeaders(option) {
        this.setState({
            headers: option.value
        });
    }
    // generate array of error messages for user objects
    // user objects are parsed from CSV input
    // if no errors, save all users
    // no users are saved if there is one or more errors
    validate(users) {
        let errors = [];
        // this regex might need to be made more strict for more stringent standards
        let email = /^.+@.+\..+$/;
        // perform fuzzy matching for boolean values
        let yes = ['1','y','yes','a','active','t','true'];
        let no = ['0','n','no','i','inactive','f','false'];
        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            if (!email.test(user.email)) {
                errors.push('Invalid email for user on line ' + (i + 1));
            }
            if (user.active) {
                user.active = user.active.toLowerCase();
                if (yes.includes(user.active)) {
                    user.active = true;
                } else if (no.includes(user.active)) {
                    user.active = false;
                } else {
                    errors.push('Unrecognized active value for user on line ' + (i + 1));
                }
            } else {
                user.active = true;
            }
            if (user.volunteer) {
                user.volunteer = user.volunteer.toLowerCase();
                if (yes.includes(user.volunteer)) {
                    user.volunteer = true;
                } else if (no.includes(user.volunteer)) {
                    user.volunteer = false;
                } else {
                    errors.push('Unrecognized volunteer value for user on line ' + (i + 1));
                }
            } else {
                user.volunteer = false;
            }
        }
        if (errors.length > 0) {
            this.setState({
                errors: errors
            });
        } else {
            this.saveMultiple(users);
        }
    }
    // enable section user add mode (hide list, show csv or form)
    add() {
        this.setState({
            creating: true,
            modeCSV: true
        });
    }
    // save either CSV data or single entry form data
    // simple validation for single entry form
    save() {
        if (this.state.modeCSV) {
            this.parseCSV();
        } else {
            let email = /^.+@.+\..+$/;
            if (!email.test(this.state.email)) {
                this.setState({
                    errors: ['Invalid email']
                });
            } else {
                this.saveSingle({
                    email: this.state.email,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    active: this.state.active,
                    volunteer: this.state.volunteer
                });
            }
        }
    }
    // exit edit or create modes, return to user list
    cancel() {
        this.setState({
            creating: false,
            editing: false
        });
    }
    parseCSV() {
        // configure column parsing order from selected state
        let columns = {
            1: ['email', 'firstName', 'lastName', 'active', 'volunteer'],
            2: ['email', 'lastName', 'firstName', 'active', 'volunteer'],
            3: ['firstName', 'lastName', 'email', 'active', 'volunteer'],
            4: ['lastName', 'firstName', 'email', 'active', 'volunteer'],
            5: ['firstName', 'email', 'lastName', 'active', 'volunteer'],
            6: ['lastName', 'email', 'firstName', 'active', 'volunteer']
        };
        // configure CSV parser with relaxed rules
        let users = parse(this.state.csv, {
            columns: columns[this.state.headers],
            trim: true,
            skip_empty_lines: true,
            relax_column_count: true
        });
        // validate parsed users, alert if no users entered
        if (users.length > 0) {
            this.validate(users);
        } else {
            this.setState({
                errors: ['No CSV data entered']
            });
        }
    }
    // save single user
    // count and total are used to supress state updates and API fetching when
    // this function is used to save multiple users in quick succession
    // (from the saveMultiple function), used for CSV data
    // this way, the user list is updated only AFTER the last of the users is saved
    saveSingle(user, count=1, total=1) {
        const saveOptions = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            active: user.active,
            volunteer: user.volunteer,
            role: this.props.role
        };

        axios.post(`/sectionUsers/${this.props.sectionID}`, saveOptions).then((response) => {
            if(response.status === 401) {
                console.log('Error submitting!');
                return false;
            } else {
                if (count === total) {
                    this.fetchAll(this.props.sectionID);
                }
            }
        });
    }
    // save all users, set count and total to suppress inefficient API calls
    saveMultiple(users) {
        // let num_users = users.length;
        // for (let i = 0; i < num_users; i++) {
        //     this.saveSingle(users[i], i+1, num_users);
        // }
        const saveOptions = {
            users: users.map((user) => {
                user.role = this.props.role;
                return user;
            }),
            role: this.props.role
        };

        axios.post(`/sectionUsers/addMany/${this.props.sectionID}`, saveOptions).then((response) => {
            if(response.status === 500) {
                console.log('Error submitting!');
                return false;
            } else {
                this.fetchAll(this.props.sectionID);
            }
        });
    }
    // store CSV data to state
    onCSVInput(event) {
        this.setState({
            csv: event.target.value
        });
    }
    // prevent default form submission behavior
    onSubmit(event) {
        event.preventDefault();
    }

    toggleActiveTable(sectionUserId, newStatus){
        let postVars = {
            active: newStatus
        };
        let endpoint = `/sectionUsers/changeActive/${sectionUserId}`;

        axios.post(endpoint, postVars).then((response) => {
            if(response.status === 201){
                console.log('Successfully changed active state', sectionUserId, newStatus);
                this.fetchAll(this.props.sectionID);
            }
        });
    }
    render() {
        if(this.state.loading){
            return <PLSpinner type={"spin"} width={50} height={50} style={{marginTop: "1rem"}}/>
        }
        // set header order options for CSV input
        let header_options = [
            { value: 1, label: this.props.strings.csvHeaders1 },
            { value: 2, label: this.props.strings.csvHeaders2 },
            { value: 3, label: this.props.strings.csvHeaders3 },
            { value: 4, label: this.props.strings.csvHeaders4 },
            { value: 5, label: this.props.strings.csvHeaders5 },
            { value: 6, label: this.props.strings.csvHeaders6 }
        ];
        // render CSV inputs
        let csv = (
            <form onSubmit={this.onSubmit.bind(this)}>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <PLSelect options={header_options} value={this.state.headers} onChange={this.changeHeaders.bind(this)} includeNone={false} />
                    <textarea rows={16} onChange={this.onCSVInput.bind(this)}/>
                </div>
            </form>
        );
        // render single entry form
        let form = (
            <form onSubmit={this.onSubmit.bind(this)}>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <PLInput onChange={this.changeEmail.bind(this)} placeholder={this.props.strings.email} style={{margin: "0.75rem 0"}}/>
                    <PLInput onChange={this.changeFirstName.bind(this)} placeholder={this.props.strings.firstName} style={{margin: "0.75rem 0"}}/>
                    <PLInput onChange={this.changeLastName.bind(this)} placeholder={this.props.strings.lastName} style={{margin: "0.75rem 0"}}/>
                </div>
                <FormControlLabel
                    control={<PLCheckbox checked={this.state.active} onChange={this.changeActive.bind(this)}/>}
                    label={this.props.strings.active}
                />
                <FormControlLabel
                    control={<PLCheckbox checked={this.state.volunteer} onChange={this.changeVolunteer.bind(this)}/>}
                    label={this.props.strings.volunteer}
                />
            </form>
        );
        // create list of users
        let users = null;
        if (this.state.users) {
            users = this.state.users.map((user, index) => {
                return (
                    <User
                        key={user.id}
                        UserID={user.id}
                        SectionID={this.props.sectionID}
                        email={user.email}
                        firstName={user.firstName}
                        lastName={user.lastName}
                        active={user.active}
                        volunteer={user.volunteer}
                        role={this.props.role}
                        status={user.status}
                        VolunteerPoolID={user.volunteerId}
                        SectionUserID={user.sectionUserId}
                        strings={this.props.strings}
                    />
                );
            });
        }
        // format error list with CSS styles
        let errors = null;
        if (this.state.errors) {
            let error_list = this.state.errors.map((error, index) => {
                return (
                    <p key={index}>{error}</p>
                );
            });
            errors = (
                <div className={'error form-error'}>
                    <i className={'fa fa-exclamation-circle'}/>
                    { error_list }
                </div>
            );
        }
        // render entry mode selection (CSV or single entry form)
        let entry_options = [
            { value: 'csv', label: this.props.strings.commaSeparatedValues },
            { value: 'form', label: this.props.strings.singleEntryForm }
        ];
        // render container for create (add) mode, wraps CSV or single form
        let create = (
            <div className='card'>
                <h2 className='title'>{this.props.title}</h2>
                <PLButton onClick={this.save.bind(this)}>{this.props.strings.save}</PLButton>
                <PLButton onClick={this.cancel.bind(this)}>{this.props.strings.cancel}</PLButton>
                <div className='card-content'>
                    <PLSelect options={entry_options} value={this.state.modeCSV ? 'csv' : 'form'} onChange={this.changeEntryMode.bind(this)} includeNone={false} />
                    { errors }
                    { this.state.modeCSV ? csv : form }
                </div>
            </div>
        );
        // render alert if no users in role for section yet
        let empty = (
            <tr><td colSpan={512}>No {this.props.title.toLowerCase()} yet.</td></tr>
        );
        // render list of users in role for section
        // future work should enable user to select which table columns to show
        // integreate with volunteer pool table to show active/volunteer flags
        // per assignment, in addition to the current section-wide parameters
        let volunteerHeader = null;
        let statusHeader = null;
        if(this.props.role === 'Student'){
            volunteerHeader = (<th>{this.props.strings.volunteer}</th>);
            statusHeader=(<th>{this.props.strings.status}</th>);
        }
        let strings={
            Email: 'Email',
            FirstName: 'First Name',
            LastName: 'Last Name',
            Active: 'Active',
            Volunteer: 'Volunteer',
            Status: 'Volunteer Status',
            NoUsers: 'There are no users to display'
        };
        let length = 100;
        if (this.state.users !== undefined) {
            length = this.state.users.length;
        }
        let observerTTDiv = "";
        if (this.props.Tooltip === "Observers are not currently implemented") {
            observerTTDiv = (<PLTooltip text={this.props.Tooltip} />);
        }
        let list = (
            <div className='card '>
                <h2 className='title'>{this.props.title}</h2>
                {observerTTDiv}
                <PLButton  onClick={this.add.bind(this)}>{this.props.strings.add}</PLButton>
                {/*<table>
                    <thead>
                        <tr>
                            <th>{this.props.strings.email}</th>
                            <th>{this.props.strings.firstName}</th>
                            <th>{this.props.strings.lastName}</th>
                            <th>{this.props.strings.active}</th>
                            {volunteerHeader}
                            {statusHeader}
                        </tr>
                    </thead>
                    <tbody>
                        { this.state.users && this.state.users.length > 0 ? users : empty }
                    </tbody>
                </table>*/}
                <PLTable
                    data={this.state.users}
                    columns={[
                        {
                            Header: strings.Email,
                            accessor: (row) => row.email,
                            id: 'email',

                        },
                        {
                            Header: strings.FirstName,
                            accessor: (row) => row.firstName,
                            id: 'firstName',
                        },
                        {
                            Header: strings.LastName,
                            accessor: (row) => row.lastName,
                            id: 'lastName',
                        },
                        {
                            Header: strings.Active,
                            accessor: (row) => row.active,
                            id: 'active',
                            Cell: ({row}) => (
                                <PLToggleSwitch
                                    checked={row.original.active}
                                    onChange={this.toggleActiveTable.bind(this, row.original.sectionUserId, (row.original.active ? 0 : 1))}
                                />
                            )
                        },
                        {
                            Header: strings.Volunteer,
                            id: 'volunteer',
                            Cell: ({row}) => (row.original.active) ?
                                <InstructorVolunteerComponent
                                    UserID={row.original.id}
                                    SectionID={this.props.sectionID}
                                    FirstName={row.original.firstName}
                                    LastName={row.original.lastName}
                                    Email={row.original.email}
                                /> : <div/>
                        },
                        {
                            Header: strings.Status,
                            accessor: (row) => row.volunteer,
                            id: 'volunteers',
                        },
                    ]}
                    noDataText={strings.NoUsers}
                    showPagination={false}
                    minRows={5}
                    pageSize={length}
                />
            </div>
        );
        // conditional rendering based on state
        if (this.state.creating) {
            return create;
        } else {
            return list;
        }
    }
}

export default UserManager;
