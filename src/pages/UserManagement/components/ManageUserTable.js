import React from "react";
import strings from "../strings";
import moment from "moment";
import PLSelect from "../../../shared/PLSelect/PLSelect";
import PLToggleSwitch from "../../../shared/PLToggleSwitch/PLToggleSwitch";
import PLButton from "../../../shared/PLButton/PLButton";
import PLTable from "../../../shared/PLTable/PLTable";

class ManageUserTable extends React.Component {
    constructor(props) {
        super(props);
    }

    makeTableRow(users) {
        return  users.map(user=>{
            const organizationGroup = user.OrganizationGroup;
            const isBlocked = "Blocked" in user.UserLogin ? user.UserLogin.Blocked : false;
            let timeout = user.UserLogin.Timeout;
            const userID = user.UserID;
            const email = user.UserContact.Email;
            let isTestUser = user.Test;
            let userRole = user.Role;
            let lastLogin = user.UserLogin.LastLogin;

            const selectOptions = [
                {value: "Admin", label: strings.admin},
                {value: "Enhanced", label: strings.enhanced},
                {value: "Participant", label: strings.participant},
                {value: "Guest", label: strings.guest},
                {value: "Teacher", label: "Teacher"}
            ];

            timeout = timeout ? moment(timeout).format("yyyy-mm-dd HH-MM-ss") : "-";
            isTestUser = isTestUser ? "Yes" : "No";
            userRole = userRole ? userRole : "No Role";
            lastLogin = lastLogin ? moment(lastLogin).format("yyyy-mm-dd HH-MM-ss") : "-";

            let orgs = "N/A";
            if(organizationGroup){
                orgs = this.props.organizations.map(org => {
                    if (organizationGroup.includes(parseInt(org.value))) {
                        return org.label;
                    } else {
                        return null;
                    }
                });
                orgs = orgs.filter(org=>org != null);
                orgs = orgs.join();
            }

            return {
                email: email,
                firstName: user.FirstName,
                lastName: user.LastName,
                organization: orgs,
                testUser:isTestUser,
                systemRole:(
                    <PLSelect
                        onChange={this.props.onRoleChange.bind(this, userID, user.FirstName+" "+user.LastName,userRole)}
                        value={userRole}
                        options={selectOptions}
                    />
                ),
                blockedStatus: (
                    <PLToggleSwitch
                        checked={isBlocked}
                        onChange={this.props.onBlockedStatusChange.bind(this, userID, email, isBlocked)}
                    />),
                resetPassword: (
                    <PLButton
                        type='button'
                        onClick={this.props.onChangePassword.bind(this, email)}
                    >
                        Reset
                    </PLButton>
                ),
                removeUser: (
                    <PLButton
                        type='button'
                        onClick={this.props.onRemoveUser.bind(this, userID, email)}
                    >
                        Remove
                    </PLButton>),
                timeoutStatus:timeout,
                lastlogin:lastLogin
            };
        });
    }

    render() {
        let td_styles = {
            margin: "auto"
        };

        const tableData = this.makeTableRow(this.props.users);

        return (
            <form name="user_management_table" role="form" className="section" method="post">
                <div className="section-content">
                    <h2 className="title">Manage Users</h2>
                    {this.props.status}
                    <PLTable
                        filterable
                        defaultPageSize={10}
                        className="user-management-table"
                        resizable={true}
                        data={tableData}
                        // className="-striped -highlight"
                        columns={[
                            {
                                Header: strings.email,
                                accessor: 'email',
                                minWidth: 200,
                                style: td_styles

                            },
                            {
                                Header: strings.fn,
                                accessor: 'firstName',
                                style: td_styles
                            },
                            {
                                Header: strings.ln,
                                accessor: 'lastName',
                                style: td_styles
                            },
                            {
                                Header: strings.organization,
                                accessor: 'organization',
                                style: td_styles
                            },
                            {
                                Header: strings.sysRole,
                                accessor: 'systemRole',
                                minWidth: 288,
                                style: td_styles,
                                sortMethod: (a, b, desc) => {
                                    const aVal = a.props.value;
                                    const bVal = b.props.value;

                                    if(aVal > bVal){
                                        return 1
                                    }
                                    if(aVal < bVal){
                                        return -1
                                    }

                                    return 0
                                }
                            },
                            {
                                Header: strings.testUser,
                                accessor: 'testUser',
                                style: td_styles
                            },
                            {
                                Header: strings.blocked,
                                accessor: 'blockedStatus',
                                style: td_styles,
                                sortMethod: (a, b, desc) => {
                                    if(a.props.isClicked === b.props.isClicked){
                                        return 0;
                                    }
                                    if(a.props.isClicked && !b.props.isClicked){
                                        return 1;
                                    }
                                    if(!a.props.isClicked && b.props.isClicked){
                                        return -1;
                                    }
                                }

                            },
                            {
                                Header: strings.timeout,
                                accessor: 'timeoutStatus',
                                style: td_styles
                            },
                            {
                                Header: strings.lastlogin,
                                accessor: 'lastlogin',
                                style: td_styles
                            },
                            {
                                Header: strings.resetPW,
                                accessor: 'resetPassword',
                                style: td_styles
                            },
                            // {
                            //     Header: strings.removeUser,
                            //     accessor: 'removeUser',
                            //     style: td_styles
                            // },

                        ]}
                        noDataText={strings.noUsers}
                    />
                </div>
            </form>
        )

    }

}

export default ManageUserTable;