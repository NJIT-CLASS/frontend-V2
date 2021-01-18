import React, {Component} from 'react';

import strings from './strings';
import axios from 'axios';

import PLSelect from "../../shared/PLSelect/PLSelect";
import withSignedInSkeleton from "../../HOC/withSignedInSkeleton/withSignedInSkeleton";
import PLSpinner from "../../shared/PLSpinner/PLSpinner";
import PLButton from "../../shared/PLButton/PLButton";

import ManageUserTable from "./components/ManageUserTable";
import Alert from "@material-ui/lab/Alert";
import {ERROR, SUCCESSFUL} from "../../constants/NOTIFICATION_TYPES";
import InviteAdministratorForm from "./components/InviteAdministratorForm";

class UserManagement extends Component{

    constructor(props){
        super(props);

        this.componentData = {
            instructorList: [],
            users:[],
            blockedNotification:null,
            removeNotification:null,
            passwordResetNotification:null,
            changeUserRoleNotification:null,
            addTestUserNotification:null,
            inviteAdminNotification:null
        };

        this.state = {
            organizations:[],
            addTestUserData:{
                selectValue:"",
                orgValue:"",
                email:"",
                fn:"",
                ln:"",
                organization:"",
                access:"",
                pw:"",
                pwInputType:"password",
                hidePW:true,
            },
            addAdminUserData:{
                selectValue:"",
                orgValue:"",
                email:"",
                fn:"",
                ln:"",
                organization:"",
                access:"",
                pw:"",
                pwInputType:"password",
                hidePW:true
            },
            changeUserRoleNotification:null,
            loaded: false
        };

    }

    componentDidMount(){
        this.fetchUsers();
    }

    fetchUsers(){
        axios.get('/userManagement').then(body => {
            this.componentData.users = body.data.Assignments;
            this.fetchOrganizations();
        });
    }

    notification(type, message){
        console.log(type);
        return (
            <Alert severity={type}>{message}</Alert>
        );
    }

    fetchOrganizations(){
        axios.get('/organization').then(body => {
            let orgs = body.data.Organization.map(org=>{
                return {
                    label:org.Name,
                    value:org.OrganizationID
                };
            });
            this.state.addAdminUserData.orgValue = {label:"None",value:-1};
            this.state.addTestUserData.orgValue = {label:"None",value:-1};
            this.setState({
                organizations:[...orgs,{label:"None",value:-1}],
                loaded:true
            });
        });
    }

    changeBlockedStatus(userID, email, isBlocked){
        console.log(userID, email, isBlocked)
        let endpoint = isBlocked ? '/userManagement/unblocked/' : '/userManagement/blocked/';

        axios.get(endpoint+userID).then(body => {
            if(body.status === 200){
                if(isBlocked){
                    this.componentData.blockedNotification = this.notification(SUCCESSFUL, email+strings.unblockedSuccess);
                } else {
                    this.componentData.blockedNotification = this.notification(SUCCESSFUL, email+strings.blockedSuccess);
                }
            } else {
                if(isBlocked){
                    this.componentData.blockedNotification = this.notification(ERROR, email+strings.unblockedFailure);
                } else {
                    this.componentData.blockedNotification = this.notification(ERROR, email+strings.blockedFailure);
                }
            }
            this.fetchUsers();
        }).catch(err => console.log(err));
    }

    resetPassword(email){
        axios.post(`/password/reset?email=${email}`).then(response => {
            if(response.status === 200){
                this.componentData.passwordResetNotification = this.notification(SUCCESSFUL, email+strings.pwResetSuccess);
            } else {
                this.componentData.passwordResetNotification = this.notification(ERROR, email+strings.pwResetFailure);
            }
            this.forceUpdate();
        });
    }

    removeUser(userID, email){
        axios.delete(`/delete/user/${userID}`).then(response => {
            if(response.status === 200){
                this.componentData.removeNotification = this.notification(SUCCESSFUL,email+strings.removeSuccess);
            } else {
                this.componentData.removeNotification = this.notification(ERROR,email+strings.removeFailure);
            }
            this.fetchUsers();
        });
    }

    changeRole(userID, name, oldRole, e){
        const newRole = e.target.value;
        axios.post('/usermanagement/role',{Role: newRole,memberID:userID}).then(response => {
            if(response.status === 200){
                this.state.changeUserRoleNotification = this.notification(SUCCESSFUL,name+": role changed from "+oldRole+" to "+newRole);
                this.fetchUsers();
            } else {
                this.state.changeUserRoleNotification = this.notification(ERROR,name+": Unable to change user role");
                this.forceUpdate();
            }
        });
    }

    handleOnFieldInput(form, field, input){
        this.state[form][field]=input.target.value;
        this.setState({
            form:this.state[form]
        });
    }

    createTestUser(){
        let testUserInfo = this.state.addTestUserData;
        let testRole = null;
        if(!testUserInfo.fn || !testUserInfo.ln || !testUserInfo.pw || !testUserInfo.access){
            this.componentData.addTestUserNotification = this.notification(ERROR,"Fields marked with a * cannot be left blank");
            this.forceUpdate();
            return;
        }

        let org = testUserInfo.organization === -1 ? null : [testUserInfo.organization];

        const postData = {
            email:testUserInfo.email,
            firstname:testUserInfo.fn,
            lastname:testUserInfo.ln,
            password:testUserInfo.pw,
            role:testUserInfo.access,
            test:true,
            organization:org};

        axios.post('/adduser', postData).then(response =>{
            if(response.status === 200  && response.data["Message"] === "User has succesfully added"){
                this.componentData.addTestUserNotification = this.notification(SUCCESSFUL,"Test User Successfully Created");
            } else {
                if(response.data["Message"] === "User is currently exist"){
                    this.componentData.addTestUserNotification = this.notification(ERROR,"Email already exists, user another email.");
                } else {
                    this.componentData.addTestUserNotification = this.notification(ERROR,"Test User could not be created");
                }
            }
            this.forceUpdate();
        });
    }

    inviteAdmin(){
        let adminInfo = this.state.addAdminUserData;

        if(!adminInfo.fn || !adminInfo.ln || !adminInfo.pw){
            this.componentData.inviteAdminNotification = this.notification(ERROR,"Fields marked with a * cannot be left blank");
            this.forceUpdate();
            return;
        }

        let org = adminInfo.organization === -1 ? null : [adminInfo.organization];
        const postData = {
            email:adminInfo.email,
            firstname:adminInfo.fn,
            lastname:adminInfo.ln,
            password:adminInfo.pw,
            role:"Admin",
            Test:false,
            organization:org
        };

        axios.post('/adduser', postData).then(response => {
            if(response.status === 200  && response.data["Message"] === "User has succesfully added"){
                console.log(response.data);
                this.componentData.inviteAdminNotification = this.notification(SUCCESSFUL,"Admin succesfully invited");
            } else {
                if(response.data["Message"] === "User is currently exist"){
                    this.componentData.inviteAdminNotification = this.notification(ERROR,"Email already exists, change role using table below.");
                } else {
                    this.componentData.inviteAdminNotification = this.notification(ERROR,"Unable to invite admin");
                }

            }
            this.forceUpdate();
        });
    }

    cancelTestUser(){

    }

    updateTestUserSelect(newValue){
        this.state.addTestUserData.access = newValue.value;
        this.state.addTestUserData.selectValue = newValue;
        this.setState({addTestUserData:this.state.addTestUserData});
    }

    updateTestOrgSelect(newValue){
        this.state.addTestUserData.organization = newValue.value;
        this.state.addTestUserData.orgValue = newValue;
        this.setState({addTestUserData:this.state.addTestUserData});
    }

    updateAdminOrg(event){
        this.state.addAdminUserData.organization = event.target.value;
        this.state.addAdminUserData.orgValue = event.target;
        this.setState({
            addAdminUserData: this.state.addAdminUserData
        });
    }

    generatePassword(form){
        let generator = require('generate-password');
        this.state[form].pw = generator.generate({length: 10,numbers: true});
        this.setState({form:this.state[form]});
    }

    retrieveTestUser(){
        console.log("Retrieve test user called");
        axios.post('/testuser/create').then((response)=>{
            console.log(response);
        });

    }

    handleToggleShowPassword(form){
        this.state[form].hidePW = !this.state[form].hidePW;
        if(this.state[form].hidePW){
            this.state[form].pwInputType = "password";
        } else{
            this.state[form].pwInputType = "text";
        }
        this.setState({form:this.state[form]});
    }



    render(){
        let instructors = this.componentData.instructorList;
        let users = this.componentData.users;
        let blockedNotification = this.componentData.blockedNotification;
        let removeNotification = this.componentData.removeNotification;
        let resetPasswordNotification = this.componentData.passwordResetNotification;
        let changeRoleNotification = this.state.changeUserRoleNotification;
        let addTestUserNotification = this.componentData.addTestUserNotification;
        let inviteAdminNotification = this.componentData.inviteAdminNotification;
        let status = null;

        if(!this.state.loaded){
            return (
                <PLSpinner />
            );
        }

        //===================================================================================================

        // Checking status for various operations and displays appropriate notifications ====================

        // Display status of blocked operation
        if(blockedNotification){
            status = blockedNotification;
            this.componentData.blockedNotification = null;
        }

        // Display status of remove notification
        if(removeNotification){
            status = removeNotification;
            this.componentData.removeNotification = null;
        }

        if(resetPasswordNotification){
            status = resetPasswordNotification;
            this.componentData.passwordResetNotification = null;
        }

        if(addTestUserNotification){
            this.componentData.addTestUserNotification = null;
        }

        if(inviteAdminNotification){
            this.componentData.inviteAdminNotification = null;
        }

        //Display result of user role change
        if(changeRoleNotification){
            status = changeRoleNotification;
            this.state.changeUserRoleNotification = null;
        }
        //=================================================================================================
        // Total content returned

        return (
            <div>
                <div>
                    <InviteAdministratorForm
                        organizations={this.state.organizations}
                        addAdminUserData={this.state.addAdminUserData}
                        notification={inviteAdminNotification}
                        onFieldInput={this.handleOnFieldInput.bind(this)}
                        onUpdateAdminOrg={this.updateAdminOrg.bind(this)}
                        onGeneratePassword={this.generatePassword.bind(this)}
                        onTogglePassword={this.handleToggleShowPassword.bind(this)}
                    />

                    {/*<form name="create_test_user" role="form" className="section" method="POST">*/}
                    {/*    <label><h2 className="title">Create Test User</h2></label>*/}
                    {/*    <div className="section-content" >*/}
                    {/*        <table className="promote-instructor-table">*/}
                    {/*            {addTestUserNotification}*/}
                    {/*            <tbody>*/}
                    {/*            <tr><td>Email* </td><td><input type="text" onChange={this.onFieldInput.bind(this,"addTestUserData","email")}/></td></tr>*/}
                    {/*            <tr><td>First Name* </td><td><input type="text" onChange={this.onFieldInput.bind(this,"addTestUserData","fn")}/></td></tr>*/}
                    {/*            <tr><td>Last Name* </td><td><input type="text" onChange={this.onFieldInput.bind(this,"addTestUserData","ln")}/></td></tr>*/}
                    {/*            <tr><td>User Role* </td><td><PLSelect className="change-role-select" clearable={false} value={this.state.addTestUserData.selectValue} onChange={this.updateTestUserSelect.bind(this)} searchable={false} options={[{value:"Guest",label:"Guest"},{value:"Participant",label:"Participant"},{value:"Teacher",label:"Teacher"},{value:"Enhanced",label:"Enhanced"},{value:"Admin",label:"Admin"}]}/></td></tr>*/}
                    {/*            <tr><td>Organization </td><td><PLSelect onChange={this.updateTestOrgSelect.bind(this)} clearable={false} searchable={false} value={this.state.addTestUserData.organization} options={this.state.organizations} /></td></tr>*/}
                    {/*            <tr><td>Password* <button type="button" onClick={this.generatePassword.bind(this,"addTestUserData")}>Generate Password</button> Hide <input checked={this.state.addTestUserData.hidePW} onClick={this.toggleHidePW.bind(this,"addTestUserData")} type="radio" /> </td><td><input disabled={true} type={this.state.addTestUserData.pwInputType} value={this.state.addTestUserData.pw}  onChange={this.onFieldInput.bind(this,"addTestUserData","pw")}/></td></tr>*/}
                    {/*            <tr><td/><td><button type="button" onClick={this.createTestUser.bind(this)}>Add</button></td></tr>*/}
                    {/*            </tbody>*/}
                    {/*        </table>*/}
                    {/*    </div>*/}
                    {/*</form>*/}
                </div>
                <div>
                    <ManageUserTable
                        users={users}
                        organizations={this.state.organizations}
                        status={status}
                        onRoleChange={this.changeRole.bind(this)}
                        onBlockedStatusChange={this.changeBlockedStatus.bind(this)}
                        onChangePassword={this.resetPassword.bind(this)}
                        onRemoveUser={this.removeUser.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

export default withSignedInSkeleton(UserManagement, 'UserManagement');
