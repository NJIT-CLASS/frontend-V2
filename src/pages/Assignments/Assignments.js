import React from 'react';
import axios from "axios";
import Container from "@material-ui/core/Container";
import PLSpinner from "../../shared/PLSpinner/PLSpinner";
import PLTable from "../../shared/PLTable/PLTable";
import withSignedInSkeleton from "../../HOC/withSignedInSkeleton/withSignedInSkeleton";

class Assignments extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            userID: props.UserID,
            loaded:false,
            assignments:null
        };
    }

    componentDidMount(){
        axios.get(`/SectionsByUser/${this.state.userID}`).then((response) => {
            const body = response.data;
            const sections = body.Sections;
            let allAssignments = [];
            sections.map(section => {
                axios.get(`/section/info/${section.SectionID}`).then((sectionResponse) => {
                    const sectionBody = sectionResponse.data;
                    let assignmentsForSection = sectionBody.OngoingAssignments.map(assignment=>{
                        return {
                            "assignmentName":assignment.DisplayName,
                            "assignmentId":assignment.AssignmentInstanceID,
                            "courseNumber":section.Section.Course.Number,
                            "courseName":section.Section.Course.Name,
                            "sectionName":section.Section.Name
                        };
                    });

                    allAssignments.push(...assignmentsForSection);
                    if(sections[ sections.length - 1].SectionID === section.SectionID){
                        this.setState({assignments:allAssignments,loaded:true});
                    }
                });
                return null
            });
        });
    }

    makeLink({value, row}){
        return <a  href={`/assignment-record/${row.original.assignmentId}`}>{value}</a>;
    }

    render(){
        return (
            <Container>
                <div id="assignmments-page-container" style={{width:"100%"}}>
                    <div className="section">
                        <div className="block-container">
                            <h2 className="title">Active Assignments</h2>
                            {!this.state.loaded ? <PLSpinner type={"bars"} width={50} height={50} style={{marginTop: "1rem"}}/> :
                                <PLTable
                                    data={this.state.assignments}
                                    columns={[
                                        {
                                            Header: "Active Assignments",
                                            accessor: 'assignmentName',
                                            Cell:this.makeLink
                                        },
                                        {
                                            Header: "Course Name",
                                            accessor: 'courseName'
                                        },
                                        {
                                            Header: "Course Number",
                                            accessor: 'courseNumber'
                                        },
                                        {
                                            Header: "Section Name",
                                            accessor: 'sectionName'
                                        }
                                    ]}
                                    noDataText={"No assignments"}
                                />
                            }
                        </div>
                    </div>
                </div>
            </Container>
        );
    }

}

export default withSignedInSkeleton(Assignments, "Assignments");