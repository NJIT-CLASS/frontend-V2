import React from "react";
import Request from "../../utils/Request";
import {Link, useHistory} from "react-router-dom";
import {Form, Formik} from "formik";
import strings from "./strings"
import * as Yup from "yup";
import makeStyles from "@material-ui/core/styles/makeStyles";
// Importing Material UI Components
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// Importing Custom Components
import PLTooltip from "../../shared/PLTooltip/PLTooltip";
import PLSpinner from "../../shared/PLSpinner/PLSpinner";
import Hr from "../../shared/Hr/Hr";

import withFormSkeleton from "../../HOC/withFormSkeleton/withFormSkeleton";
import Typography from "@material-ui/core/Typography";

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email(strings.EMAIL_VALIDATION1)
        .required(strings.EMAIL_VALIDATION2),
});

const useStyles = makeStyles((theme) => ({
    formGroupRoot: props => ({
        display: "inline-block",
        width: "100%",
        height: "36px",
    }),

    textFieldRoot: props => ({
        width: "85%",
        marginBottom: "20px"
    }),
}));

const ForgotPassword = () => {
    const classes = useStyles();
    const history = useHistory();

    const handleCancel = () => {
        history.goBack();
    };

    return (
        <React.Fragment>
            <Paper className={"paper"} elevation={3}>
                <Grid justify={"center"} alignItems={"center"} item container>
                    <Typography variant={"h6"} gutterBottom>{strings.ACTION_TEXT}</Typography>
                    <div style={{marginLeft: "10px"}}>
                        <PLTooltip text={strings.TOOLTIP1} placement={"right"} />
                    </div>
                    <Hr width={"90%"} />
                </Grid>

                <Formik
                    initialValues= {{email: ""}}
                    validateOnChange={false}
                    // validateOnBlur={false}
                    validationSchema={validationSchema}
                    onSubmit={async (values, formState) =>{
                        formState.setSubmitting(true);
                        console.log(Request.baseURL)
                    }}
                >
                    {({errors, values, handleSubmit, isSubmitting, handleChange, handleBlur}) => (
                        isSubmitting ? (
                            <PLSpinner />
                        ):(
                            <Form>
                                <Grid>
                                    <PLTooltip placement={"right"} text={strings.TOOLTIP2}>
                                        <TextField
                                            id={"email"}
                                            name={"email"}
                                            type="text"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.email}
                                            error={!!errors.email}
                                            label={errors.email?strings.TEXT_FIELD_ERROR_LABEL: ""}
                                            helperText={errors.email}
                                            placeholder={strings.PLACEHOLDER_TEXT1}
                                            size={"small"}
                                            variant="outlined"
                                            classes={{root: classes.textFieldRoot}}
                                        />
                                    </PLTooltip>
                                </Grid>
                                <Grid>
                                    <FormGroup row classes={{row: classes.formGroupRoot}}>
                                        <FormControlLabel
                                            control={
                                                <Button
                                                    variant={"contained"}
                                                    disableElevation
                                                    onClick={handleCancel}
                                                    color={"primary"}
                                                    // style={{position: "absolute", left: "2rem", bottom: "1.2rem"}}
                                                >
                                                    {strings.BUTTON_TEXT2}
                                                </Button>
                                            }
                                        />
                                        <FormControlLabel
                                            control={
                                                <Button
                                                    type={"submit"}
                                                    variant={"contained"}
                                                    disabled={isSubmitting}
                                                    disableElevation
                                                    onSubmit={handleSubmit}
                                                    color={"primary"}
                                                    // style={{right: "2rem", bottom: "1.2rem"}}
                                                >
                                                    {strings.BUTTON_TEXT1}
                                                </Button>
                                            }
                                        />
                                    </FormGroup>
                                </Grid>
                            </Form>
                        )
                    )}
                </Formik>
            </Paper>
            <Grid>
                <p>{strings.LINK_TEXT1_PART1}<Link to="/about" className="link">{strings.LINK_TEXT1_PART2}</Link></p>
            </Grid>
        </React.Fragment>
    )
};

export default withFormSkeleton(ForgotPassword, "ForgotPassword");
