import React from "react";
import Grid from "@material-ui/core/Grid";
import useTheme from "@material-ui/core/styles/useTheme";
import routes from "../../routes/routes";

import "./withFormSkeleton.scss"

const withFormSkeleton = (WrappedForm, name) => {
    return (props) => {
        const theme = useTheme();
        document.title = `${routes[name].title} | PL System`;
        return (
            <Grid justify={"center"} alignItems={"center"} container>
                <Grid sm={1} md={2} item/>
                <Grid sm={"auto"} md={"auto"} item>
                    <div className="form-container">
                        <Grid justify={"center"} alignItems={"center"} direction={"column"} container item>
                            <Grid>
                                <h2>
                                    <i className={theme.brandLogo.name}/>
                                    <span>{theme.brandLogo.title}</span>
                                </h2>
                            </Grid>
                            <WrappedForm {...props}/>
                        </Grid>
                    </div>
                </Grid>
                <Grid sm={1} md={2} item/>
            </Grid>
        )
    }
};

export default withFormSkeleton