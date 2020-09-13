import React from 'react';
import axios from 'axios';
import PLSelect from "../../../shared/PLSelect/PLSelect";
import PLButton from "../../../shared/PLButton/PLButton";
import MenuItem from "@material-ui/core/MenuItem";
import PLSpinner from "../../../shared/PLSpinner/PLSpinner";
import PLInput from "../../../shared/PLInput/PLInput";

class SectionManager extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            id: ``
        };
    }
    // load all sections when both courseID and semesterID are selected in parent
    componentDidMount() {
        this.fetchAll(this.props.courseID, this.props.semesterID);
    }
    // reset sectionID if courseID or semesterID change (clear dropdown selection)
    // reload all sections based on course and semester
    UNSAFE_componentWillReceiveProps(props) {
        if (this.props.organizationID !== props.organizationID ||
            this.props.courseID !== props.courseID ||
            this.props.semesterID !== props.semesterID) {
            this.setState({
                id: ''
            });
        }
        this.fetchAll(props.courseID, props.semesterID);
    }
    // get all sections in course and semester
    // store in ID, Name tuples for select dropdown
    fetchAll(courseID, semesterID) {

        axios.get(`/getCourseSections/${courseID}?semesterID=${semesterID}`).then((response) => {
            let list = [];
            const body = response.data;
            for (let section of body.Sections) {
                list.push({ value: section.SectionID, label: section.Name });
            }
            this.setState({
                list: list,
                loading: false
            });
        });
    }
    // fetch single section information for editing
    fetch() {
        axios.get(`/section/${this.state.id}`).then((response) => {
            const body = response.data;
            this.setState({
                identifier: body.Section.Name,
                editing: true
            });
        });
    }
    // enable create mode
    create() {
        this.setState({
            creating: true
        });
    }
    // retrieve data before editing
    edit() {
        this.fetch();
    }
    // delete section
    // casading deletes need to be thought through (which tables should be cascaded)
    // add confirmation to prevent accidental deletion
    delete() {
        axios.get(`/section/delete/${this.state.id}`).then((response) => {
            this.changeID({
                value: ''
            });
            this.fetchAll();
        });
    }
    // update single section (identifier is the same as name, just different vocubulary for user interface)
    // exit edit or create mode on successful save, reload section list with new section
    update() {
        const updateOptions = {
            name: this.state.identifier,
            sectionid: this.state.id
        };

        axios.post('/course/updatesection', updateOptions).then((response) => {
            const body = response.data;
            if(response.status === 401) {
                console.log('Error submitting!');
            } else if (!body.Message) {
                console.log('Error: Section already exists.');
            }
            else {
                this.setState({
                    creating: false,
                    editing: false
                });
                this.fetchAll(this.props.courseID, this.props.semesterID);
            }
        });
    }
    // discard changes, exit create or edit mode
    cancel() {
        this.setState({
            creating: false,
            editing: false
        });
    }
    // propagate sectionID change to parent for rendering of other components
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
    // change identifier (name) of section
    changeIdentifier(event) {
        this.setState({
            identifier: event.target.value
        });
    }
    // save new section, set new sectionID, reload section list with new section
    save() {
        const saveOptions = {
            semesterid: this.props.semesterID,
            courseid: this.props.courseID,
            name: this.state.identifier,
            organizationid: this.props.organizationID
        };

        axios.post('/course/createsection', saveOptions).then((response) => {
            const body = response.data;
            if(response.status === 401) {
                console.log('Error submitting!');
            } else {
                this.changeID({
                    value: body.result.SectionID
                });
                this.fetchAll(this.props.courseID, this.props.semesterID);
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
        // display dropdown list of sections with new and edit buttons
        // disable edit button until a section is selected
        let select = (
            <div className='card'>
                <h2 className='title'>{this.props.strings.section}</h2>
                <PLButton onClick={this.create.bind(this)}>{this.props.strings.new}</PLButton>
                { this.state.id ?
                    <PLButton onClick={this.edit.bind(this)}>{this.props.strings.edit}</PLButton>:
                    <PLButton type='button' onClick={this.edit.bind(this)} disabled>{this.props.strings.edit}</PLButton>
                }

                <form className='card-content' onSubmit={this.onSubmit.bind(this)}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <PLSelect value={this.state.id} onChange={this.changeID.bind(this)}  placeholder={"Course"}>
                            {notnullList.map((org) => {
                                return <MenuItem value={org.value} key={org.value}>{org.label}</MenuItem>
                            })}
                        </PLSelect>
                    </div>
                </form>
            </div>
        );

        let create = (
            <div className='card'>
                <h2 className='title'>{this.props.strings.newSection}</h2>

                <PLButton onClick={this.cancel.bind(this)}>{this.props.strings.cancel}</PLButton>
                <PLButton onClick={this.save.bind(this)}>{this.props.strings.save}</PLButton>

                <form className='card-content' onSubmit={this.onSubmit.bind(this)}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <PLInput onChange={this.changeIdentifier.bind(this)} placeholder={"Section Name"} style={{marginBottom: "1rem"}}/>
                    </div>
                </form>
            </div>
        );

        let edit = (
            <div className='card'>
                <h2 className='title'>{this.props.strings.editSection}</h2>

                <PLButton onClick={this.cancel.bind(this)}>{this.props.strings.cancel}</PLButton>
                <PLButton onClick={this.delete.bind(this)}>{this.props.strings.delete}</PLButton>
                <PLButton onClick={this.update.bind(this)}>{this.props.strings.save}</PLButton>

                <form className='card-content' onSubmit={this.onSubmit.bind(this)}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <PLInput
                            value={this.state.identifier}
                            onChange={this.changeIdentifier.bind(this)}
                            placeholder={"Identifier"}
                            style={{marginBottom: "1rem"}}
                        />
                    </div>
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

export default SectionManager;
