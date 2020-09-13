import React from 'react';
import axios from "axios"
// import MultiNotificationsComponent from './multiNotificationComponent';
import OldNotificationsComponent from './OldNotificationsComponent';

class OldNotificationsContainer extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            Courses: [],
            showOld: true
        };
    }
    componentDidMount() {
        axios.get(`/oldnotifications/user/${this.props.UserID}`).then((response) => {
            const {data} = response;
            this.setState({
                Notifications: data.Notifications.reverse()
            })
        })
    }

    toggleOld() {
        if (this.state.showOld) {
            this.setState({showOld: false});
        }
        else {
            this.setState({showOld: true});
        }
    }

    render() {
        let {Strings} = this.props;
        let i = 1;
        return (
            <div className="section card-2" onClick={this.toggleOld.bind(this)}>
                <h2 className="title">{Strings.OldNotifications}
                    <span className={'fa fa-angle-' + (this.state.showOld ? 'up' : 'down')} style={{float: 'right'}}/>
                </h2>
                {this.state.showOld &&
                (<div className="section-content">
                    {(this.state.Notifications !== undefined) && (this.state.Notifications.map((notification, index, array) => {
                        return (
                            <OldNotificationsComponent
                                key={i++}
                                Notification={notification}
                                OriginTaskInstanceID={notification.OriginTaskInstanceID}
                                Update={this.fetchNotifications.bind(this)}
                            />
                        );
                    }))}
                    {(this.state.Notifications !== undefined) && (this.state.Notifications.length === 0) && Strings.NoNotifications}
                </div>
                )}
            </div>
        );
    }
}

export default OldNotificationsContainer