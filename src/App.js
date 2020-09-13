import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";

import routes from "./routes/routes";

import Dashboard from "./pages/Dashboard/Dashboard";
import About from "./pages/About/About";
import AboutUs from "./pages/About/About-loggedin";
// import Account from "./pages/Account/Account";
import AssignmentEditor from "./pages/AssignmentEditor/AssignmentEditor";
import Login from "./pages/Login/Login";
import InitialPasswordChange from  "./pages/InitialPasswordChange/InitialPasswordChange"
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Assignments from "./pages/Assignments/Assignments"
import EveryonesWork from "./pages/EveryonesWork/EveryonesWork"
import QuickAssignmentReport from "./pages/QuickAssignmentReport/QuickAssignmentReport";
import CourseSectionManagement from "./pages/CourseSectionManagement/CourseSectionManagement";


const App = () => {
    const userId = 193;
    return (
        <React.Fragment>
            <CssBaseline />
            <BrowserRouter>
                <Switch>
                    <Route path={routes.Dashboard.path} render={() => <Dashboard {...routes.Dashboard} UserID={userId}/>} exact />
                    <Route path={routes.Assignments.path} render={() => <Assignments {...routes.Assignments} UserID={userId} />} exact />
                    <Route path={routes.AboutLoggedIn.path} render={() => <AboutUs {...routes.AboutLoggedIn} />} exact />
                    <Route path={routes.EveryonesWork.path} render={() => <EveryonesWork {...routes.EveryonesWork} UserID={userId} />} exact />
                    {/*<Route path={routes.Account.path} render={() => <Account {...routes.EveryonesWork} UserID={userId} />} exact />*/}
                    <Route path={routes.CourseSectionManagement.path} render={() => <CourseSectionManagement {...routes.CourseSectionManagement} UserID={userId} />} exact />
                    <Route path={routes.AssignmentEditor.path} render={() => <AssignmentEditor {...routes.AssignmentEditor} UserID={userId} />} exact />


                    <Route path={routes.QuickAssignmentReport.path} render={() => <QuickAssignmentReport {...routes.QuickAssignmentReport} hasInstructorPrivilege />} exact />
                    <Route path={routes.About.path} render={() => <About {...routes.About} />} exact />

                    <Route path={routes.Login.path} render={() => <Login {...routes.Login} />} exact />
                    <Route path={routes.ForgotPassword.path} render={() => <ForgotPassword {...routes.ForgotPassword} />} exact />
                    <Route path={routes.InitialPasswordChange.path} render={() => <InitialPasswordChange {...routes.InitialPasswordChange} />} exact />
                </Switch>
            </BrowserRouter>
        </React.Fragment>

    );
};

export default App;
