import React, { Component } from 'react';
import PLModal from "../../../shared/PLModal/PLModal";

import Hr from "../../../shared/Hr/Hr";
import {withStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

// function to convert given miliseconds into hours, mintues, seconds
// returns an object {hours, minutes, seconds}
const covertToHMS = (time) => {
    let hours = Math.floor(time/3600);
    time = time%3600;
    let minutes = Math.floor(time/60);
    time = time%60;
    let seconds = Math.floor(time);
    return [hours, minutes, seconds]
};

const styles = {
    moreInformation: {
        borderCollapse: "separate",
        borderSpacing: "10px 5px",
        textAlign: "left"
    }
};

// This component renders a modal panel which displays information about a task instance (passed in as a prop).
class MoreInformation extends Component {

    userHistoryTable(prevUsers) {
        const {classes} = this.props;
        // Returns a table of all of this task's previously assigned users
        const thead = (
            <thead>
            <tr>
                <th>User ID</th>
                <th>Email</th>
                <th>For Extra Credit</th>
                <th>Date Assigned</th>
            </tr>
            </thead>
        );

        const rows = prevUsers.reverse().map((prevUser, index) => {
            const extraCredit = prevUser.is_extra_credit;
            let allocatonDate = new Date(prevUser.time);
            allocatonDate = allocatonDate.toDateString() + ' ' + allocatonDate.toTimeString().split(' ')[0];
            const user = this.props.sectionInfo.users.find(user => user.id === prevUser.user_id);
            if(user === undefined || user === null){
                return <tr>
                    <td/>
                    <td/>
                    <td/>
                    <td/>
                </tr>;
            }
            return (
                <tr key={index}>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>{extraCredit ? 'yes' : 'no'}</td>
                    <td>{allocatonDate}</td>
                </tr>
            );
        });

        return (
            <div>
                <Typography variant={"h5"}>User History</Typography>
                {rows.length > 0 ? (
                    <table className={classes.moreInformation}>
                        {thead}
                        <tbody>{rows}</tbody>
                    </table>
                ) : 'No previously assigned users'}
            </div>
        );
    }

    statusTable() {
        // Returns a table displaying all of this task's statuses.
        const {classes} = this.props;
        const taskInstanceStatuses = JSON.parse(this.props.taskInstance.Status);
        const statusLabels = [
            'Execution',
            'Cancelled',
            'Revision',
            'Due Status',
            'Page Interaction',
            'Reallocation'
        ];
        const rows = statusLabels.map((label, index) => (
            <tr key={index}>
                <th>{label}:</th><td>{taskInstanceStatuses[index]}</td>
            </tr>
        ));

        return (
            <div>
                <Typography variant={"h5"}>Status</Typography>
                <table className={classes.moreInformation}>
                    <tbody>{rows}</tbody>
                </table>
            </div>
        );
    }

    timeLine(){
        const {classes} = this.props;
        const timeString = (hours, minutes, seconds) => {
            const bold = {fontWeight: "700"};
            return (
                <span>
                    {hours}&nbsp;<span style={bold}>{hours <= 1 ? "hr-":"hrs-"}</span>
                    {minutes}&nbsp;<span style={bold}>{minutes <= 1 ? "min-":"mins-"}</span>
                    {seconds}&nbsp;<span style={bold}>{seconds <= 1 ? "sec":"secs"}</span>
                </span>
            )
        };
        let {StartDate, EndDate, ActualEndDate } = this.props.taskInstance;
        let submitted = ActualEndDate !== null;
        StartDate = new Date(StartDate);
        EndDate = new Date(EndDate);
        ActualEndDate = new Date(ActualEndDate);
        let timeLapesedInMilliSecs = Date.now() - StartDate;
        let timeToCompleteTaskInMilliSecs = ActualEndDate - StartDate;
        let lateByInMilliSecs = Date.now() - EndDate;

        let [hrs, mins, secs] = covertToHMS(timeLapesedInMilliSecs/1000);
        let timeLapesedString = timeString(hrs, mins, secs);
        let [hrs1, mins1, secs1] = covertToHMS(timeToCompleteTaskInMilliSecs/1000);
        let timeToCompleteString = timeString(hrs1, mins1, secs1);
        let [hrs2, mins2, secs2] = covertToHMS(lateByInMilliSecs/1000);
        let lateBySting = timeString(hrs2, mins2, secs2);
        let tableBody = null;

        const [execution, cancelled, , dueStatus,] = JSON.parse(this.props.taskInstance.Status);

        switch(execution){
            case "complete":
                tableBody = (
                    <tbody>
                    <tr>
                        <th>Completed in:</th><td>{timeToCompleteString}</td>
                    </tr>
                    <tr>
                        <th>Started At:</th><td>{StartDate.toUTCString()}</td>
                    </tr>
                    <tr>
                        <th>Submission Deadline:</th><td>{EndDate.toUTCString()}</td>
                    </tr>
                    <tr>
                        <th>{cancelled!=="normal" ? "Cancelled At" : "Submitted At"}:</th><td>{ActualEndDate.toUTCString()}</td>
                    </tr>
                    </tbody>
                );
                break;
            case "not_yet_started":
                if(cancelled!=="cancelled"){
                    tableBody = (
                        <tbody>
                        <tr>
                            <th>Time Elapsed:</th><td>Not Started...</td>
                        </tr>
                        <tr>
                            <th>Started At:</th><td>Not Started...</td>
                        </tr>
                        <tr>
                            <th>Submission Deadline:</th><td>Not Started...</td>
                        </tr>
                        <tr>
                            <th>Submitted At:</th><td>Not Started...</td>
                        </tr>
                        </tbody>
                    )
                }else{
                    tableBody = (
                        <tbody>
                        <tr>
                            <th>Time Elapsed:</th><td>Cancelled...</td>
                        </tr>
                        <tr>
                            <th>Started At:</th><td>Cancelled...</td>
                        </tr>
                        <tr>
                            <th>Submission Deadline:</th><td>Cancelled...</td>
                        </tr>
                        <tr>
                            <th>Cancelled At:</th><td>{ActualEndDate.toUTCString()}</td>
                        </tr>
                        </tbody>
                    )
                }
                break;
            case "started":
                if(cancelled!=="cancelled"){
                    tableBody = (
                        <tbody>
                        <tr>
                            <th>{dueStatus === "late" ? "Overdue by":"Time Elapsed"}:</th><td>{dueStatus === "late" ? lateBySting:timeLapesedString}</td>
                        </tr>
                        <tr>
                            <th>Started At:</th><td>{StartDate.toUTCString()}</td>
                        </tr>
                        <tr>
                            <th>Submission Deadline:</th><td>{EndDate.toUTCString()}</td>
                        </tr>
                        <tr>
                            <th>Submitted At:</th><td>{!submitted ? "Not Submitted": ActualEndDate.toUTCString()}</td>
                        </tr>
                        </tbody>
                    )
                }else{
                    tableBody = (
                        <tbody>
                        <tr>
                            <th>Time Elapsed:</th><td>Cancelled...</td>
                        </tr>
                        <tr>
                            <th>Started At:</th><td>Cancelled...</td>
                        </tr>
                        <tr>
                            <th>Submission Deadline:</th><td>Cancelled...</td>
                        </tr>
                        <tr>
                            <th>Cancelled At:</th><td>{ActualEndDate.toUTCString()}</td>
                        </tr>
                        </tbody>
                    )
                }
                break;
            case "bypassed":
                tableBody = (
                    <tbody>
                    <tr>
                        <th>Time Elapsed:</th><td>Bypassed</td>
                    </tr>
                    <tr>
                        <th>Started At:</th><td>{StartDate.toUTCString()}</td>
                    </tr>
                    <tr>
                        <th>Submission Deadline:</th><td>{EndDate.toUTCString()}</td>
                    </tr>
                    <tr>
                        <th>Bypassed At:</th><td>{ActualEndDate.toUTCString()}</td>
                    </tr>
                    </tbody>
                );
                break;
            case "automatic":
                tableBody = (
                    <tbody>
                    <tr>
                        <th>Time Elapsed:</th><td>Automatic</td>
                    </tr>
                    <tr>
                        <th>Start At:</th><td>Automatic</td>
                    </tr>
                    <tr>
                        <th>Submit By:</th><td>Automatic</td>
                    </tr>
                    <tr>
                        <th>Submitted At:</th><td>Automatic</td>
                    </tr>
                    </tbody>
                );
                break;
            default:
                tableBody = null
        }

        return (
            <div>
                <Typography variant={"h5"}>Time-Line</Typography>
                <table className={classes.moreInformation}>
                    {tableBody}
                </table>
            </div>
        );

    }

    render() {
        const {classes} = this.props;
        const prevUsers = JSON.parse(this.props.taskInstance.UserHistory);

        // Remove the currently assigned user from the list of previous users.
        // The current user will be displayed separately.
        let currentUser = prevUsers.pop();

        // Merge in the current user's email address since we want to display that too.
        const users = this.props.sectionInfo.users;
        let currentUserID = this.props.taskInstance.User.UserID;
        let currentUserData = users.find(user => user.id === currentUser.user_id);
        let currentUserEmail = null;
        if(currentUserData == null || currentUserData.length === 0){
            currentUserData =  users.find(user => user.id === currentUserID);
        }
        currentUserEmail = currentUserData.email;
        currentUser = { ...currentUser, email: currentUserEmail, fullName: `${this.props.taskInstance.User.FirstName} ${this.props.taskInstance.User.LastName}`};

        const taskInstanceID = this.props.taskInstance.TaskInstanceID;
        const taskName = this.props.taskInstance.TaskActivity.DisplayName;
        const assignmentName = this.props.sectionInfo.assignmentName;


        return (
            <PLModal
                open={this.props.open}
                onClose={this.props.onClose}
            >
                <Typography variant={"h5"} gutterBottom={true}>More Information</Typography>
                <Hr />
                <table className={classes.moreInformation}>
                    <tbody>
                    <tr><th>Task Display Name:</th><td>{taskName}</td></tr>
                    <tr><th>Task Instance ID:</th><td>{taskInstanceID}</td></tr>
                    <tr><th>Assignment Display Name:</th><td>{assignmentName}</td></tr>
                    </tbody>
                </table>
                <Hr />
                {this.timeLine()}
                <Hr />
                {this.statusTable()}
                <Hr />
                <Typography>Currently assigned to: {currentUser.email} (User ID: {currentUser.user_id})</Typography>
                <Typography>For extra credit: {currentUser.is_extra_credit ? 'yes' : 'no'}</Typography>
                <br />
                {this.userHistoryTable(prevUsers)}
                <br/>
                {JSON.parse(this.props.taskInstance.Status)[0] === "complete" ? (
                    <p><span style={{fontWeight: "700"}}>Completed By:</span> {currentUser.fullName} (User ID: {currentUser.user_id}) </p>
                ): null}
            </PLModal>
        );
    }
}

export default withStyles(styles)(MoreInformation);
