import React, { Component } from 'react';
// import MultiNotificationsComponent from './multiNotificationComponent';
import NotificationsComponent from './notificationComponent';
// import OldNotificationsComponent from './OldNotificationsComponent';
import axios from "axios"

class NotificationsContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Courses: [],
            showOld: false
        };
    }

    componentDidMount() {
        axios.get(`/notifications/user/${this.props.UserID}`).then(response => {
            const {data} = response;
            this.setState({
                Notifications: data.Notifications.reverse()
            })
        });
    }

    showOld() {
        this.setState({showOld: true});
    }

    hideOld(){
        this.setState({showOld: false});
    }

    render() {
        let {Strings} = this.props;
        let i = 1;
        return (
            <div className="section card-2">
                <h2 className="title">{Strings.Notifications}</h2>
                <div className="section-content">
                    {(this.state.Notifications !== undefined) && (this.state.Notifications.map((notification, index, array) => {
                        console.log(notification.Dismiss);
                        return (
                            <NotificationsComponent
                                key={i++}
                                Notification={notification}
                                OriginTaskInstanceID={notification.OriginTaskInstanceID}
                                Update={this.fetchNotifications.bind(this)}
                            />
                            // else if (this.state.showOld){
                            // return (
                            //       <OldNotificationsComponent
                            //         key={i++}
                            //         Notification={notification}
                            //         OriginTaskInstanceID={notification.OriginTaskInstanceID}
                            //         Update={this.fetchNotifications.bind(this)}
                            //         />
                            // );
                        );
                    }))}
                    {(this.state.Notifications !== undefined) && (this.state.Notifications.length === 0) && Strings.NoNotifications}
                </div>
            </div>
        );
    }
}

export default NotificationsContainer;