import React, { Component } from 'react';
import axios from 'axios'
import ListItemComponent from './ListItemComponent';

class EveryonesWorkContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            ListOfWorkflows: {},
            Loaded: false
        };
    }

    componentDidMount() {
        this.fetchAssignmentInstanceIds()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.AssignmentID !== "" && this.props.AssignmentID !== prevProps.AssignmentID){
            this.fetchAssignmentInstanceIds()
        }
    }

    fetchAssignmentInstanceIds(){
        axios.get(`/EveryonesWork/AssignmentInstanceID/${this.props.AssignmentID}`).then((response) => {
            const body = response.data;
            this.setState({
                ListOfWorkflows: body.Workflows,
                AssignmentInfo: body.AssignmentInfo,
                Loaded: true
            });
        });
    }

    render() {
        let {Loaded, ListOfWorkflows, AssignmentInfo} = this.state;
        let {UserID} = this.props;
        if(!Loaded){
            return <div></div>;
        }
        const listofWorkflows = Object.keys(ListOfWorkflows).map((workflowActivityId, workflowIndex) => {
            const listOfTasks = ListOfWorkflows[workflowActivityId].Tasks.map( (taskObject, index) =>
                <ListItemComponent
                    key={workflowActivityId + ' ' + index}
                    TaskObject={taskObject}
                    UserID={UserID}
                    selectWorkflow={this.props.selectWorkflow}
                />
            );

            let titleText = AssignmentInfo.Name == null ? '': `${AssignmentInfo.Name} -`;
            if(ListOfWorkflows[workflowActivityId].Name !== ''){
                if(ListOfWorkflows[workflowActivityId].Name === 'Problem'){
                    titleText = `${titleText}  
                    ${ListOfWorkflows[workflowActivityId].Name} ${(workflowIndex + 1)}`;
                }
                else {
                    titleText = ListOfWorkflows[workflowActivityId].Name;
                }
            }

            return (
                <div className="section" key={`${workflowActivityId}`}>
                    <div className="title">{`${titleText}`}</div>
                    <div className="section-content">
                        <div>
                            <b>{AssignmentInfo.Course} - {AssignmentInfo.Section} - {AssignmentInfo.Semester}</b>
                            <span>{AssignmentInfo.Instructions}</span>
                        </div>
                        {listOfTasks}
                    </div>
                </div>
            );
        });

        return (
            <div className="list-group">
                {listofWorkflows}
            </div>
        );
    }
}

export default EveryonesWorkContainer;