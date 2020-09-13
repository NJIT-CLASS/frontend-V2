import React from 'react';
import axios from "axios";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import PLSelect from "../../../shared/PLSelect/PLSelect";
import PLButton from "../../../shared/PLButton/PLButton";
import MenuItem from "@material-ui/core/MenuItem";
import PLSpinner from "../../../shared/PLSpinner/PLSpinner";
import moment from "moment";

import PLTooltip from "../../../shared/PLTooltip/PLTooltip";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import TextField from "@material-ui/core/TextField";
import PLInput from "../../../shared/PLInput/PLInput";


class SemesterManager extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            DeleteChangeMessage: '',
            loading: true,
            id: ``,
            startDate: moment().format('YYYY-MM-DD'),
            endData: moment().format('YYYY-MM-DD')
        };
    }
    // fetch all semesters when card is loaded
    componentDidMount() {
        this.fetchAll(this.props.organizationID);
    }
    // fetch all semesters when organizationID prop changes
    UNSAFE_componentWillReceiveProps(props) {
        if(this.props.organizationID !== props.organizationID) {
            this.setState({
                id: ''
            });
        }
        this.fetchAll(props.organizationID);
    }
    // retrieve all semesters for given organization
    // store in semesterID, Name tuples for select dropdown
    fetchAll() {
        axios.get(`/getOrganizationSemesters/${this.props.organizationID}`).then((response) => {
            let list = [];
            const body = response.data;
            for (let sem of body.Semesters) {
                list.push({ value: sem.SemesterID, label: sem.Name });
            }
            this.setState({
                list: list,
                loading: false
            });
        });
    }
    // fetch single semester organization for editing
    fetch() {
        axios.get(`/semester/${this.state.id}`).then((response) => {
            const body = response.data;
            this.setState({
                name: body.Semester.Name,
                startDate: body.Semester.StartDate.split('T')[0],
                endDate: body.Semester.EndDate.split('T')[0],
                editing: true
            });
        });
    }
    // enabled creation mode with state
    create() {
        this.setState({
            creating: true
        });
    }
    // retrieve semester data before editing
    edit() {
        this.fetch();
    }

    //two level warning check
    deleteChange(num) {
        if (num === 1) {
            this.setState({DeleteChangeMessage: 'check-1'});
        }
        if (num === 2) {
            this.setState({DeleteChangeMessage: 'check-2'});
        }
    }
    // delete semester
    // additional confirmation should be presented to user to prevent data loss
    delete() {
        this.setState({DeleteChangeMessage: ''});
        axios.get(`/semester/delete/${this.state.id}`).then((response) => {
            this.changeID({
                value: ''
            });
            this.fetchAll();
        });
    }

    closeDeleteMessage() {
        this.setState({DeleteChangeMessage: ''});
    }
    // update name, start date, and end date of semester
    // exit edit or create mode, reload semester list with updated semester
    update() {
        const updateOptions = {
            Name: this.state.name,
            Start: this.state.startDate,
            End: this.state.endDate
        };

        axios.post(`/semester/update/${this.state.id}`, updateOptions).then((res) => {
            const body = res.data;
            if(res.status === 401) {
                console.log('Error submitting!');
            } else if (!body.Message) {
                console.log('Error: Semester already exists.');
            }
            else {
                this.setState({
                    creating: false,
                    editing: false
                });
                this.fetchAll();
            }
        });
    }
    // exit create or edit mode
    cancel() {
        this.setState({
            creating: false,
            editing: false
        });
        this.setState({DeleteChangeMessage: ''});
    }
    // propagate new semesterID to parent for rendering
    changeID(event) {
        let value = null;
        if(event.value === undefined){
            value = event.target.value;
        }else{
            value = event.value
        }
        if(this.state.id !== value) {
            this.setState({
                id: value,
                creating: false,
                editing: false
            });
            this.props.changeID(value);
        }
    }
    // next three functions are simple state storage for form fields
    changeName(event) {
        this.setState({
            name: event.target.value
        });
    }
    changeStartDate(dateString) {
        this.setState({
            startDate: moment(dateString).format('YYYY-MM-DD')
        });
    }
    changeEndDate(dateString) {
        this.setState({
            endDate: moment(dateString).format('YYYY-MM-DD')
        });
    }
    // save new semester, reload semester list on success
    save() {
        const saveOptions = {
            organizationID: this.props.organizationID,
            semesterName: this.state.name,
            start_sem: this.state.startDate,
            end_sem: this.state.endDate
        };

        axios.post('/createSemester', saveOptions).then((res) => {
            const body = res.data;
            if(res.status === 401) {
                console.log('Error submitting!');
            } else if (!body.sem_feedback) {
                console.log('Error: Semester already exists');
            }
            else {
                this.changeID({
                    value: body.newsemester.SemesterID
                });
                this.fetchAll(this.props.organizationID);
            }
        });
    }
    // prevent default form submission
    onSubmit(event) {
        event.preventDefault();
    }
    render() {
        if(this.state.loading){
            return <PLSpinner type={"spin"} width={50} height={50} style={{marginTop: "1rem"}}/>
        }

        const notnullList = this.state.list.filter(o => o.label !== null && o.value !== null);

        // render semester list dropdown
        // disable edit button unless a semester is selected
        let select = (
            <div className='card'>
                <h2 className='title'>{this.props.strings.semester}</h2>
                <PLButton onClick={this.create.bind(this)}>{this.props.strings.new}</PLButton>
                { this.state.id ?
                    <PLButton onClick={this.edit.bind(this)}>{this.props.strings.edit}</PLButton> :
                    <PLButton onClick={this.edit.bind(this)} disabled>{this.props.strings.edit}</PLButton>
                }

                <form className='card-content' onSubmit={this.onSubmit.bind(this)}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <PLSelect value={this.state.id} onChange={this.changeID.bind(this)} placeholder={"Semester"}>
                            {notnullList.map((org) => {
                                return <MenuItem value={org.value} key={org.value}>{org.label}</MenuItem>
                            })}
                        </PLSelect>
                    </div>
                </form>
            </div>
        );

        // render semester creation form
        // update the date fields for easier date entry (perhaps with a react module)
        let create = (
            <div className='card'>
                <h2 className='title'>{this.props.strings.newSemester}</h2>

                <PLButton onClick={this.cancel.bind(this)}>{this.props.strings.cancel}</PLButton>
                <PLButton onClick={this.save.bind(this)}>{this.props.strings.save}</PLButton>

                <form className='card-content' onSubmit={this.onSubmit.bind(this)}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <PLTooltip text={this.props.strings.newSemesterToolTip} placement={"right"}>
                            <TextField
                                onChange={this.changeName.bind(this)}
                                placeholder={"Name (include semester)"}
                                variant={"outlined"}
                                label={"Name (include semester)"}
                            />
                        </PLTooltip>
                    </div>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            label={this.props.strings.startDate}
                            value={this.state.startDate}
                            onChange={this.changeStartDate.bind(this)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            style={{marginRight: "1rem"}}
                        />
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            label={this.props.strings.endDate}
                            value={this.state.endDate}
                            onChange={this.changeEndDate.bind(this)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </form>
            </div>
        );

        // render editing form
        // again, update date fields with better date entry interface
        let edit = (
            <div className='card'>
                <h2 className='title'>{this.props.strings.editSemester}</h2>

                <PLButton onClick={this.cancel.bind(this)}>{this.props.strings.cancel}</PLButton>
                <PLButton onClick={this.deleteChange.bind(this, 1)}>{this.props.strings.delete}</PLButton>
                <PLButton onClick={this.update.bind(this)}>{this.props.strings.save}</PLButton>

                {(this.state.DeleteChangeMessage === 'check-1') &&
                <div>
                    <div className="error form-error">
                        <i className="fa fa-exclamation-circle" style={{paddingRight: 7}}/>
                        <span>{this.props.strings.deleteSemester}</span></div>
                    <PLButton className="ynbutton" onClick={this.deleteChange.bind(this, 2)}>{this.props.strings.yes}</PLButton>
                    <PLButton className="ynbutton" onClick={this.closeDeleteMessage.bind(this)}>{this.props.strings.no}</PLButton>
                </div>
                }
                {(this.state.DeleteChangeMessage === 'check-2') &&
                <div>
                    <div className = "error form-error" style={{display: 'inline'}}>
                        <i className="fa fa-exclamation-circle" style={{paddingRight: 7}}/>
                        <span>{this.props.strings.deleteSemDoubleCheck}</span></div>
                    <PLButton className = "ynbutton" onClick={this.delete.bind(this)}>{this.props.strings.yes}</PLButton>
                    <PLButton className = "ynbutton" onClick={this.closeDeleteMessage.bind(this)}>{this.props.strings.no}</PLButton>
                </div>
                }

                <form className='card-content' onSubmit={this.onSubmit.bind(this)} style={{marginTop: "3.5rem"}}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <PLInput value={this.state.name} onChange={this.changeName.bind(this)} placeholder={this.props.strings.name}/>
                    </div>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            label={this.props.strings.startDate}
                            value={this.state.startDate}
                            onChange={this.changeStartDate.bind(this)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            style={{marginRight: "1rem"}}
                        />
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            label={this.props.strings.endDate}
                            value={this.state.endDate}
                            onChange={this.changeEndDate.bind(this)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </form>
            </div>
        );

        // conditional rendering based on state
        if(this.state.creating) {
            return create;
        } else if (this.state.editing) {
            return edit;
        } else {
            return select;
        }
    }
}

export default SemesterManager;
