import {ROLES} from "../constants/ROLES";

const routes =  {
    "Dashboard": {
        title: "Dashboard",
        path: "/dashboard",
        access:{
            admins: true,
            instructors: true,
            students: true,
            role: null,
            loggedOut: true
        },
        template: true,
        sideBarOpen: true,
        logo: "fa fa-home",
    },

    "Assignments": {
        title: 'All Assignments\' Status',
        path: "/assignments-page",
        access:{
            admins: true,
            instructors: true,
            students: false,
            role: ROLES.PARTICIPANT,
            loggedOut: false
        },
        template: true,
        sideBarOpen: false,
        logo: "fa fa-list",
    },

    "EveryonesWork": {
        title: 'See Everyone\'s Work',
        path: "/everyones-work/:assignmentId",
        access:{
            admins: true,
            instructors: true,
            students: true,
            role: ROLES.PARTICIPANT,
            loggedOut: false
        },
        template: true,
        sideBarOpen: false,
        logo: "fa fa-users",
    },

    "AboutLoggedIn": {
        title: "About Participatory Learning",
        path: "/about-us",
        access:{
            admins: true,
            instructors: true,
            students: true,
            role: ROLES.GUEST,
            loggedOut: false
        },
        template: true,
        sideBarOpen: false,
        logo: "fa fa-info-circle",
    },

    "About": {
        title: "About",
        path: "/about",
        access:{
            admins: true,
            instructors: true,
            students: true,
            role: ROLES.GUEST,
            loggedOut: false
        },
        template: false,
        sideBarOpen: false,
        logo: "fa fa-info-circle",
    },

    "Account": {
        title: 'My Profile',
        path: '/account',
        access: {
            admins: true,
            instructors: true,
            students: true,
            role: ROLES.GUEST,
            loggedOut: false
        },
        template: true,
        sideBarOpen: false,
        logo: "fa fa-user-circle",

    },

    "CourseSectionManagement": {
        title: 'Course Management',
        path: '/course-section-management',
        access: {
            admins: true,
            instructors: true,
            students: false,
            role: ROLES.TEACHER,
            loggedOut: false
        },
        template: true,
        sideBarOpen: false,
        logo: "fa fa-sitemap",

    },

    "AssignmentEditor": {
        title: 'Assignment Editor',
        path: '/asa/:courseId',
        access: {
            admins: true,
            instructors: true,
            students: false,
            role: ROLES.TEACHER,
            loggedOut: false
        },
        template: true,
        sideBarOpen: false,
        logo: "fa fa-edit",
    },

    "QuickAssignmentReport": {
        title: 'Assignment Status',
        path: "/assignment-record/:assignmentId",
        access:{
            admins: true,
            instructors: true,
            students: true,
            role: ROLES.TEACHER,
            loggedOut: false
        },
        template: false,
        sideBarOpen: false,
    },

    "Login": {
        title:"Login",
        path:"/",
        access: {
            admins: true,
            instructors: true,
            students: true,
            role: null,
            loggedOut: true
        },
        template: false,

    },
    "InitialPasswordChange": {
        title:"Login",
        path:"/initial-password-change",
        access: {
            admins: true,
            instructors: true,
            students: true,
            role: ROLES.GUEST,
            loggedOut: false
        },
        template: false,
    },
    "ForgotPassword": {
        title: "Rest Password",
        path: "/rest-password",
        access: {
            admins: true,
            instructors: true,
            students: true,
            role: null,
            loggedOut: true
        },
        template: false,
    },
};

export default routes


