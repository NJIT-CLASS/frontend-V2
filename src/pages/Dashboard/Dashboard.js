import * as React from "react";
import strings from "./strings"
import Grid from "@material-ui/core/Grid";
import withSignedInSkeleton from "../../HOC/withSignedInSkeleton/withSignedInSkeleton"

import CoursesComponent from "./components/courseComponent";
import NotificationsContainer from "./components/notificationContainer";
import OldNotificationsContainer from "./components/oldNotificationsContainer";
import PendingTaskComponent from "./components/pendingTasksComponent";
import CompletedTaskComponent from "./components/completedTasksComponent";

class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            Notifications:[],
            Strings: strings
        };
    }

    componentDidMount(){
        // this.props.__(strings, (newStrings) => {
        //     this.setState({Strings: newStrings});
        // });
    }

    render() {
        let {Strings} = this.state;
        return (
            <Grid container>
                <Grid item sm={12} md={12} lg={4} xl={4}>
                    <CoursesComponent Strings={Strings} UserID={this.props.UserID}/>
                    <NotificationsContainer Strings={Strings} UserID={this.props.UserID}/>
                    <OldNotificationsContainer Strings={Strings} UserID={this.props.UserID}/>
                </Grid>
                <Grid item sm={12} md={12} lg={8} xl={8}>
                    <PendingTaskComponent Strings={Strings} UserID={this.props.UserID}/>
                    <CompletedTaskComponent Strings={Strings} UserID={this.props.UserID}/>
                </Grid>
            </Grid>
       );
    }
}

export default withSignedInSkeleton(Dashboard, "Dashboard");
