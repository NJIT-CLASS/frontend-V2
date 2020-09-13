import React, {useEffect, useState} from 'react';
import moment from 'moment';
import axios from 'axios'
import {Link} from "react-router-dom";
import PLTooltip from "../../../shared/PLTooltip/PLTooltip";
import PLTable from "../../../shared/PLTable/PLTable";
import PLSpinner from "../../../shared/PLSpinner/PLSpinner";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    lateTask: {
        color: theme.palette.error.main
    }
}));

const PendingTaskComponent = ({UserID, Strings}) => {
    const [pendingTasksData, setPendingTasksData] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const classes = useStyles();

    const makeDate = ({value, row}) => {
        return <span className={row.original.Status[3] === 'late'? classes.lateTask:""}>{moment(value).format('MMMM Do, YYYY h:mm a')}</span>;
    };

    const makeCourse = ({value, row}) => {
        let displayText = value;
        const {CourseNumber, SectionName, Status} = row.original;
        if(CourseNumber != null && SectionName != null){
            displayText = `${CourseNumber} - ${SectionName}`;
        }
        if (Status[3] === 'late') {
            return <div className={classes.lateTask}>{displayText}</div>;
        }
        return <div>{displayText}</div>;
    };

    const makeRevisionLabel = ({value, row}) =>{
        let txt = `${value}`;
        if(row.original.Revision === true || row.original.Status[2].indexOf('submitted_for_approval') !== -1 || row.original.Status[2].indexOf('being_revised') !== -1 ) {
            txt = `(${Strings.Revision}) ${value}`;
        }
        return <div className={row.original.Status[3] === 'late'? classes.lateTask:""}>{txt}</div>;
    };

    const makeLink = ({value, row}) => {
        return <Link to={`/task/${row.original.TaskID}`}>{value}</Link>;
    };

    const makeCode = ({value, row}) => {
        if(value.indexOf("#1") !== -1){
            return (
                <div style={{position:"relative"}}>
                    <div style={{color:"orange",display:"inline-block"}}>#1</div>
                    <div style={{display:"inline-block"}} className={classes.lateTask}>{value.substring(value.indexOf("#1")+3,value.length)}</div>
                </div>
            );
        }

        if (row.original.Status[3] === 'late') {
            return <div className={classes.lateTask}>{value}</div>;
        }
        return ""
    };

    const codeColumnHeader = <div>{Strings.CodeHeader}<PLTooltip size={17} text={Strings.CodeTooltipExplanation} style={{marginLeft: "0.25rem"}}/></div>;

    const tableColumns = React.useMemo(() =>  [
        {
            Header: Strings.Assignment,
            accessor: d => d.Assignment,
            Cell:makeLink,
            id:'Pending-Assignment',

        }, {
            Header: Strings.Type,
            accessor: 'Type',
            id:'Pending-Type',
            Cell:makeRevisionLabel,
            resizable:true,
        }, {
            Header: Strings.Course,
            accessor: 'Course',
            resizable:true,
            Cell: makeCourse
        },{
            Header: Strings.DueDate,
            resizable:true,
            accessor: 'Date',
            Cell: makeDate
        },{
            Header: codeColumnHeader,
            resizable:true,
            accessor: 'Code',
            Cell: makeCode
        }
    ], []);

    useEffect(() => {
        axios.get(`/getPendingTaskInstances/${UserID}`).then((response) => {
            if(response.status === 200) {
                const {data} = response;
                let transformedTaskList = data.PendingTaskInstances.map(task => {
                    let code = "";
                    if (task.TaskActivity.MustCompleteThisFirst) {
                        code += " #1 ";
                    }
                    if (task.Status.indexOf("late") !== -1) {
                        code += " ! ";
                    }
                    return {
                        Assignment: task.AssignmentInstance.DisplayName,
                        TaskID: task.TaskInstanceID,
                        Type: task.TaskActivity.DisplayName,
                        Course: task.AssignmentInstance.Section.Course.Name,
                        CourseNumber: task.AssignmentInstance.Section.Course.Number,
                        SectionName: task.AssignmentInstance.Section.Name,
                        Revision: task.TaskActivity.AllowRevision,
                        Status: typeof task.Status === 'string' ? JSON.parse(task.Status) : task.Status,//task.Status,
                        Date: task.EndDate,
                        Code: code
                    };
                });
                setPendingTasksData(transformedTaskList);
                setDataLoaded(true);
            }
    })}, []);

    console.log("Rendering Pending Tasks Component");
    return (
        <div className="section card-2 sectionTable">
            <h2 className="title">{Strings.PendingTasks}</h2>
            <div className="section-content">
                <span style={{backgroundColor: '#C7C7C7', fontSize: '14px', textAlign: 'center', display: 'inline-block', padding: '5px', width: '99%'}}>{Strings.RedHeader}</span>
                {!dataLoaded? <PLSpinner type={"bars"} width={50} height={50} style={{marginTop: "1rem"}}/>:
                    <PLTable
                        data={pendingTasksData}
                        columns={tableColumns}
                        defaultSorted={[
                            {
                                id: 'Date',
                                desc: false
                            }
                        ]}
                        noDataText={Strings.NoPending}
                    />
                }
            </div>
        </div>
    )
};

export default React.memo(PendingTaskComponent)
