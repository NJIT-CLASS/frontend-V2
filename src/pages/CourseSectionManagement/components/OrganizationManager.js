import React from 'react';
import axios from "axios";
import PLSelect from "../../../shared/PLSelect/PLSelect";
import PLButton from "../../../shared/PLButton/PLButton";
import PLInput from "../../../shared/PLInput/PLInput";
import Dropzone from 'react-dropzone';
import MenuItem from "@material-ui/core/MenuItem";
import PLSpinner from "../../../shared/PLSpinner/PLSpinner";
import Typography from "@material-ui/core/Typography";


class OrganizationManager extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            DeleteChangeMessage: '',
            loading: true,
            id: ``
        };
    }
    // load all organizations when page loads
    componentDidMount() {
        this.fetchAll();
    }
    // retrieve all organizations in system
    // format as organizationID, Name tuples for select component
    fetchAll() {
        axios.get('/organization').then((response) => {
            let list = [];
            const body = response.data;
            for (let org of body.Organization) {
                list.push({ value: org.OrganizationID, label: org.Name});
            }
            this.setState({
                list: list,
                loading: false
            });
        });
    }
    // get single organization information for editing
    fetch() {
        axios.get(`/organization/${this.state.id}`).then((response) => {
            const body = response.data;
            this.setState({
                name: body.Organization.Name,
                editing: true
            });
        });
    }
    // enable creation mode
    create() {
        this.setState({
            creating: true
        });
    }
    // fetch organization information before editing
    edit() {
        this.fetch();
    }
    // delete organization, cascade deletes
    // EXTENSIVE, PARANOID confirmation should be added here
    // opportunity for MASSIVE accidental data loss
    // reload organization list after deletion, nullify selected ID, propagate to parent

//two level warning check
    deleteChange(num) {
        if (num === 1) {
            this.setState({DeleteChangeMessage: 'check-1'});
        }
        if (num === 2) {
            this.setState({DeleteChangeMessage: 'check-2'});
        }
    }
    closeDeleteMessage() {
        this.setState({DeleteChangeMessage: ''});
    }

    delete() {
        this.setState({DeleteChangeMessage: ''});
        axios.get(`/organization/delete/${this.state.id}`).then((_) => {
            this.changeID({
                value: ''
            });
            this.fetchAll();
        });
    }
    // update organization name, logo editing should be added
    update() {
        const updateOptions = {
            Name: this.state.name
        };

        axios.post(`/organization/update/${this.state.id}`, updateOptions).then((res) => {
            const body = res.data;
            if(res.statusCode === 401) {
                console.log('Error submitting!');
            } else if (!body.Message) {
                console.log('Error: Organization already exists.');
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
    // exit edit or creation mode, return to list
    cancel() {
        this.setState({
            creating: false,
            editing: false
        });
        this.setState({DeleteChangeMessage: ''});
    }
    // send selected ID to parent if it changed, exit edit mode on successful ID change
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
    // store organization name into state on entry
    changeName(event) {
        this.setState({
            name: event.target.value
        });
    }
    // save new organization, send new organizationID to parent for rendering
    // reload organization list to show new organization
    save() {
        const saveOptions = {
            //userid: this.props.userID,
            organizationname: this.state.name
        };

        axios.post('/createorganization', saveOptions).then((response) => {
            const body = response.data;
            if(response.statusCode === 401) {
                console.log('Error submitting!');
            } else if (!body.org_feedback) {
                console.log('Error: Organization already exists.');
            }
            else {
                this.changeID({
                    value: body.neworganization.OrganizationID
                });
                this.fetchAll();
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
        // show organization dropdown list with edit and new buttons
        // disable edit button unless there is a selected organization
        let select = (
            <div className='card'>
                <h2 className='title'>{this.props.strings.organization}</h2>
                <PLButton onClick={this.create.bind(this)}>{this.props.strings.new}</PLButton>
                { this.state.id ?
                    <PLButton onClick={this.edit.bind(this)}>{this.props.strings.edit}</PLButton>:
                    <PLButton onClick={this.edit.bind(this)} disabled>{this.props.strings.edit}</PLButton>
                }

                <form className='card-content' onSubmit={this.onSubmit.bind(this)}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <PLSelect value={this.state.id} onChange={this.changeID.bind(this)} placeholder={"Organization"}>
                            {notnullList.map((org) => {
                                return <MenuItem value={org.value} key={org.value}>{org.label}</MenuItem>
                            })}
                        </PLSelect>
                    </div>
                </form>
            </div>
        );

        // show new organization creation form
        // add Dropzone for organization logo here
        let create = (
            <div className='card'>
                <h2 className='title'>{this.props.strings.newOrganization}</h2>

                <PLButton onClick={this.cancel.bind(this)}>{this.props.strings.cancel}</PLButton>
                <PLButton onClick={this.save.bind(this)}>{this.props.strings.save}</PLButton>

                <form className='card-content' onSubmit={this.onSubmit.bind(this)}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <PLInput onChange={this.changeName.bind(this)} placeholder={"Name of Organization"}/>
                    </div>
                </form>
            </div>
        );

        // show organization editing form
        // fix Dropzone for organization logo here (not fully functional)
        let edit = (
            <div className='card'>
                <h2 className='title'>{this.props.strings.editOrganization}</h2>
                <PLButton onClick={this.cancel.bind(this)}>{this.props.strings.cancel}</PLButton>
                <PLButton onClick={this.deleteChange.bind(this, 1)}>{this.props.strings.delete}</PLButton>
                <PLButton onClick={this.update.bind(this)}>{this.props.strings.save}</PLButton>

                {(this.state.DeleteChangeMessage === 'check-1') &&
                <div>
                    <div className={"error form-error"}>
                        <i className="fa fa-exclamation-circle" style={{paddingRight: 7}}/>
                        <span>{this.props.strings.deleteOrganization}</span>
                    </div>
                    <PLButton className="ynbutton" onClick={this.deleteChange.bind(this, 2)}>{this.props.strings.yes}</PLButton>
                    <PLButton className="ynbutton" onClick={this.closeDeleteMessage.bind(this)}>{this.props.strings.no}</PLButton>
                </div>
                }
                {(this.state.DeleteChangeMessage === 'check-2') &&
                <div>
                    <div className = "error form-error">
                        <i className="fa fa-exclamation-circle" style={{paddingRight: 7}}/>
                        <span>{this.props.strings.deleteOrgDoubleCheck}</span>
                    </div>
                    <PLButton className="ynbutton" onClick={this.delete.bind(this)}>{this.props.strings.yes}</PLButton>
                    <PLButton className="ynbutton" onClick={this.closeDeleteMessage.bind(this)}>{this.props.strings.no}</PLButton>
                </div>
                }

                <form className='card-content' style={{marginTop: "2.5rem"}} onSubmit={this.onSubmit.bind(this)}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <PLInput value={this.state.name} onChange={this.changeName.bind(this)} placeholder={"Name of Institution"} defaultValue={this.state.name} />
                    </div>
                    <label>
                        <Typography variant={"h6"} style={{margin: "0.75rem 0"}}>{this.props.strings.logo}</Typography>
                    </label>
                    <Dropzone>{this.props.strings.upload}</Dropzone>
                </form>
            </div>
        );

        if(this.state.creating) {
            return create;
        } else if (this.state.editing) {
            return edit;
        } else {
            return select;
        }
    }
}

export default OrganizationManager;
