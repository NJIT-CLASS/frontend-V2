import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Icon from "@material-ui/core/Icon";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";

import strings from "./strings";

const useStyles = makeStyles((theme) => ({
    listNesting: {
        paddingLeft: "80px"
    },
    paperRoot: {
        margin: "0.5rem",
        paddingBottom: "2.5rem",
        paddingTop: "1rem"
    }
}));

// TODO: CONVERT IT INTO A FOR LOOP
const HelpList =  () => {
    const classes = useStyles();
    return (
        <Paper classes={{root: classes.paperRoot}} elevation={2}>
            <List dense>
                <ListSubheader component="div" id="nested-list-subheader">
                    <Typography variant="h6" gutterBottom align={"center"}>{strings.LIST_HEADER}</Typography>
                </ListSubheader>
                <ListItem divider/>
                <ListItem>
                    <ListItemIcon classes={{root: classes.listIconRoot}}><Icon className={"fas fa-circle"} style={{fontSize: 10}} /></ListItemIcon>
                    <ListItemText primary={strings.LIST1} />
                </ListItem>
                <ListItem>
                    <ListItemIcon classes={{root: classes.listIconRoot}}><Icon className={"fas fa-circle"} style={{fontSize: 10}} /></ListItemIcon>
                    <ListItemText primary={strings.LIST2} />
                </ListItem>
                <ListItem>
                    <ListItemIcon classes={{root: classes.listIconRoot}}><Icon className={"fas fa-circle"} style={{fontSize: 10}} /></ListItemIcon>
                    <ListItemText primary={strings.LIST3} />
                </ListItem>
                <List component="div" disablePadding dense>
                    <ListItem className={classes.listNesting}>
                        <ListItemIcon classes={{root: classes.listIconRoot}}><Icon className={"fas fa-circle"} style={{fontSize: 10}} /></ListItemIcon>
                        <ListItemText primary={strings.LIST4} />
                    </ListItem>
                    <ListItem className={classes.listNesting}>
                        <ListItemIcon classes={{root: classes.listIconRoot}}><Icon className={"fas fa-circle"} style={{fontSize: 10}} /></ListItemIcon>
                        <ListItemText primary={strings.LIST5} />
                    </ListItem>
                    <ListItem className={classes.listNesting}>
                        <ListItemIcon classes={{root: classes.listIconRoot}}><Icon className={"fas fa-circle"} style={{fontSize: 10}} /></ListItemIcon>
                        <ListItemText primary={strings.LIST6} />
                    </ListItem>
                    <ListItem className={classes.listNesting}>
                        <ListItemIcon classes={{root: classes.listIconRoot}}><Icon className={"fas fa-circle"} style={{fontSize: 10}} /></ListItemIcon>
                        <ListItemText primary={strings.LIST7} />
                    </ListItem>
                </List>
            </List>
        </Paper>
    )
};

export default HelpList
