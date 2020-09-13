import React, {useEffect, useState} from 'react';
import axios from "axios";
import moment from 'moment';
import PLTable from "../../../shared/PLTable/PLTable";
import PLSpinner from "../../../shared/PLSpinner/PLSpinner";
import {Link} from "react-router-dom";

const CompletedTaskComponent = ({UserID, Strings}) => {
    const [completedTasksData, setCompletedTasksData] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);


    const makeDate = ({value}) => {
        return <span>{moment(value).format('MMMM Do, YYYY h:mm a')}</span>;
    };

    const makeLink = ({value, row}) => {
        return <Link to={`/task/${row.original.TaskID}`}>{value}</Link>;
    };

    const makeCourse = ({value, row}) => {
        let displayText = value;
        if(row.original.CourseNumber != null && row.original.SectionName != null){
            displayText = `${row.original.CourseNumber} - ${row.original.SectionName}`;
        }
        return <div>{displayText}</div>;
    };

    const tableColumns = React.useMemo(() =>  [
        {
            Header: Strings.Assignment,
            accessor: 'Assignment',
            Cell: makeLink,
        },
        {
            Header: Strings.Type,
            accessor: 'Type'
        },
        {
            Header: Strings.Course,
            accessor: 'Course',
            Cell: makeCourse

        },{
            Header: Strings.EndDate,
            accessor: 'Date',
            Cell: makeDate
        }
    ], []);

    useEffect(() => {
        axios.get(`/getCompletedTaskInstances/${UserID}`).then((response) => {
            const {data} = response;
            if(response.status === 200){
                let transformedTaskList = data.CompletedTaskInstances.map(task => {
                    return {
                        Assignment: task.AssignmentInstance.DisplayName,
                        TaskID: task.TaskInstanceID,
                        Type: task.TaskActivity.DisplayName,
                        CourseNumber: task.AssignmentInstance.Section.Course.Number,
                        SectionName: task.AssignmentInstance.Section.Name,
                        Course: task.AssignmentInstance.Section.Course.Name,
                        Date: task.ActualEndDate,
                    };
                });
                setCompletedTasksData(transformedTaskList);
                setDataLoaded(true);
            }
        })}, []);

    console.log("Rendering Completed Tasks Component");
    return (
        <div className="section card-2 sectionTable">
            <h2 className="title">{Strings.CompletedTasks}</h2>
            <div className="section-content">
                {!dataLoaded? <PLSpinner type={"bars"} width={50} height={50} style={{marginTop: "1rem"}}/>:
                    <PLTable
                        data={completedTasksData}
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

export default React.memo(CompletedTaskComponent)
