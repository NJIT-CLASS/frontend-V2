import React from 'react';
import axios from "axios";
import PLSelect from "../../../shared/PLSelect/PLSelect";
import PLButton from "../../../shared/PLButton/PLButton";
import PLInput from "../../../shared/PLInput/PLInput";
import MenuItem from "@material-ui/core/MenuItem";
import PLSpinner from "../../../shared/PLSpinner/PLSpinner";


class CourseManager extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            DeleteChangeMessage: '',
            loading: true,
            id: ``
        };
    }

    // load all courses when selected organization changes
    componentDidMount() {
        this.fetchAll(this.props.organizationID);
    }
    // reload courses when organizationID changes
    UNSAFE_componentWillReceiveProps(props) {
        if(this.props.organizationID !== props.organizationID) {
            this.setState({
                id: ''
            });
        }
        this.fetchAll(props.organizationID);
    }
    // fetch all courses belonging to an organization
    // store courseIDs in array along with name and number
    // list is used in select element
    // courses displayed in "Number - Name" format
    fetchAll(organizationID) {
        axios.get(`/getOrganizationCourses/${organizationID}`).then((response) => {
            let list = [];
            const body = response.data;
            for (let course of body.Courses) {
                list.push({ value: course.CourseID, label: course.Number + ' – ' + course.Name });
            }
            this.setState({
                list: list,
                loading: false
            });
        });
    }
    // fetch course info for editing
    fetch() {
        axios.get(`/course/${this.state.id}`).then((response) => {
            const body = response.data;
            this.setState({
                name: body.Course.Name,
                number: body.Course.Number,
                editing: true
            });
        });
    }
    // display new course page
    create() {
        this.setState({
            creating: true
        });
    }
    // load information before editing
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

    // delete course, cascade deletes
    delete() {
        this.setState({DeleteChangeMessage: ''});
        axios.get(`/course/delete/${this.state.id}`).then((response) => {
            this.changeID({
                value: ''
            });
            this.fetchAll();
        });
    }

    closeDeleteMessage() {
        this.setState({DeleteChangeMessage: ''});
    }
    // update number and name of course, reload course list, exit edit mode
    update() {
        const updateOptions = {
            Number: this.state.number,
            Name: this.state.name
        };

        axios.post(`/course/update/${this.state.id}`, updateOptions).then((res) => {
            const body = res.data;
            if(res.status === 401) {
                console.log('Error submitting!');
            } else if (!body.Message) {
                console.log('Error: Course already exists.');
            }
            else {
                this.setState({
                    creating: false,
                    editing: false
                });
                this.fetchAll(this.props.organizationID);
            }
        });
    }
    // discard changes and return to list
    cancel() {
        this.setState({
            creating: false,
            editing: false
        });
        this.setState({DeleteChangeMessage: ''});
    }
    // on successful creation of course, new ID is passed to parent
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
                editing: false,
                loading: true
            });
            this.props.changeID(value);
        }
    }
    // store course name to state
    changeName(event) {
        this.setState({
            name: event.target.value
        });
    }
    // store course number to state
    changeNumber(event) {
        this.setState({
            number: event.target.value
        });
    }
    // save new course, update selected courseID, reload course list
    save() {
        const saveOptions = {
            userid: this.props.userID,
            number: this.state.number,
            Name: this.state.name,
            organizationid: this.props.organizationID
        };

        // TODO Cannot crate!!!
        axios.post('/course/create', saveOptions).then((res) => {
            const body = res.data;
            if(res.status === 401) {
                console.log('Error submitting!');
            } else if (!body.Message) {
                console.log('Error: Course already exists.');
            }
            else {
                this.changeID({
                    value: body.NewCourse.CourseID
                });
                this.fetchAll(this.props.organizationID);
            }
        });
    }
    // prevent forms from being submitted normally
    onSubmit(event) {
        event.preventDefault();
    }
    render() {
        if(this.state.loading){
            return <PLSpinner type={"spin"} width={50} height={50} style={{marginTop: "1rem"}}/>
        }

        const notnullList = this.state.list.filter(o => o.label !== null && o.value !== null);
        // show dropdown list of courses
        // enable edit button if a course is selected
        let select = (
            <div className='card'>
                <h2 className='title'>{this.props.strings.course}</h2>
                <PLButton type='button' onClick={this.create.bind(this)}>{this.props.strings.new}</PLButton>
                { this.state.id ?
                    <PLButton type='button' onClick={this.edit.bind(this)}>{this.props.strings.edit}</PLButton>:
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


        // display form to create new course
        let create = (
            <div className='card'>
                <h2 className='title'>{this.props.strings.newCourse}</h2>

                <PLButton onClick={this.cancel.bind(this)}>{this.props.strings.cancel}</PLButton>
                <PLButton onClick={this.save.bind(this)}>{this.props.strings.save}</PLButton>

                <form className='card-content' onSubmit={this.onSubmit.bind(this)}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <PLInput onChange={this.changeNumber.bind(this)} placeholder={"Course Number"} style={{marginBottom: "1rem"}}/>
                        <PLInput onChange={this.changeName.bind(this)} placeholder={"Course Name"} style={{marginBottom: "1rem"}}/>
                    </div>
                </form>
            </div>
        );

        // display form to edit existing course, prepopulated with existing data
        let edit = (
            <div className='card'>
                <h2 className='title'>{this.props.strings.editCourse}</h2>
                <PLButton onClick={this.cancel.bind(this)}>{this.props.strings.cancel}</PLButton>
                <PLButton onClick={this.deleteChange.bind(this, 1)}>{this.props.strings.delete}</PLButton>
                <PLButton onClick={this.update.bind(this)}>{this.props.strings.save}</PLButton>

                {(this.state.DeleteChangeMessage === 'check-1') &&
                <div>
                    <div className="error form-error">
                        <i className="fa fa-exclamation-circle" style={{paddingRight: 7}}/>
                        <span>{this.props.strings.deleteCourse}</span>
                    </div>
                    <PLButton className="ynbutton" onClick={this.deleteChange.bind(this, 2)}>{this.props.strings.yes}</PLButton>
                    <PLButton className="ynbutton" onClick={this.closeDeleteMessage.bind(this)}>{this.props.strings.no}</PLButton>
                </div>
                }
                {(this.state.DeleteChangeMessage === 'check-2') &&
                <div>
                    <div className="error form-error">
                        <i className="fa fa-exclamation-circle" style={{paddingRight: 7}}/>
                        <span>{this.props.strings.deleteCourseDoubleCheck}</span>
                    </div>
                    <PLButton className="ynbutton" onClick={this.delete.bind(this)}>{this.props.strings.yes}</PLButton>
                    <PLButton className="ynbutton" onClick={this.closeDeleteMessage.bind(this)}>{this.props.strings.no}</PLButton>
                </div>
                }

                <form className='card-content' style={{marginTop: "3.5rem"}} onSubmit={this.onSubmit.bind(this)}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <PLInput
                            value={this.state.number}
                            onChange={this.changeNumber.bind(this)}
                            placeholder={"Course Number"}
                            defaultValue={this.state.number}
                            style={{marginBottom: "1rem"}}
                        />
                        <PLInput
                            value={this.state.name}
                            onChange={this.changeName.bind(this)}
                            placeholder={"Course Name"}
                            defaultValue={this.state.name}
                            style={{marginBottom: "1rem"}}
                        />
                    </div>
                </form>
            </div>
        );

        // conditionally render create or edit modes by state
        if(this.state.creating) {
            return create;
        } else if (this.state.editing) {
            return edit;
        } else {
            return select;
        }
    }
}

export default CourseManager;
