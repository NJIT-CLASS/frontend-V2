import React from 'react';
import MarkupTextInline from "../../../utils/MarkupTextInline";


const trunc = (str, n ) => {
    if(str == null) return '';
    if (str.length <= n) { return str; }
    let subString = str.substr(0, n-1);
    if(subString == null) return '';
    return (subString.substr(0, subString.lastIndexOf(' ')) ) + '...';
};

const ListItemComponent = (props) => {
    const {TaskObject} = props;
    let taskId = TaskObject.LatestTask;
    let taskData = TaskObject.FirstTask != null ? JSON.parse(TaskObject.FirstTask.Data) : null;
    if(taskData !== null){
        let problemText = trunc(taskData[0][0][0], 100);
        if(taskId != null){
            return (
                <li className="list-group-item item-hover" onClick={props.selectWorkflow.bind(this, TaskObject.WorkflowInstanceID)} style={{ cursor: 'pointer', paddingTop: 0, paddingBottom: 0 }}>
                    <MarkupTextInline content={problemText}/>
                </li>
            )
        } else {
            return (
                <li className="list-group-item item-hover" style={{paddingTop: 0, paddingBottom: 0}}>
                    <MarkupTextInline content={problemText}/>
                </li>
            );
        }
    } else {
        return null;
    }

};
export default ListItemComponent;