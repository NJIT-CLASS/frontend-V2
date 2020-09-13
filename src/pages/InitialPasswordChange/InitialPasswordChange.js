import React from "react";
import {Link} from "react-router-dom";
import {Form, Formik} from "formik";
import strings from "./strings"
import * as Yup from "yup";
import makeStyles from "@material-ui/core/styles/makeStyles";
import withFormSkeleton from "../../HOC/withFormSkeleton/withFormSkeleton";

// Importing Material UI Components
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";

// Importing Custom Components
import PLSpinner from "../../shared/PLSpinner/PLSpinner";
import Hr from "../../shared/Hr/Hr";
import Typography from "@material-ui/core/Typography";


//Yep equality test
Yup.addMethod(Yup.string, 'equalTo', function(ref, msg){
    return this.test({
        name: 'equalTo',
        exclusive: false,
        message: msg,
        params: {
            reference: ref.path
        },
        test: function(value) {
            return value === this.resolve(ref)
        }
    })
});

const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required(strings.CURRENT_PASSWORD_VALIDATION1),
    newPassword: Yup.string().min(6, strings.NEW_PASSWORD_VALIDATION1).required(strings.NEW_PASSWORD_VALIDATION2),
    confirmPassword: Yup.string().equalTo(Yup.ref('newPassword'), strings.CONFIRM_PASSWORD_VALIDATION1)
});

const useStyles = makeStyles((theme) => ({
    textFieldRoot: props => ({
        width: "75%",
        marginBottom: "15px"
    }),
    formGroupRoot: props => ({
        display: "flex",
        justifyContent: "space-around",
    }),
}));

const InitialPasswordChange = () => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Paper className={"paper"} elevation={3}>
                <Grid>
                    <Typography variant={"h6"} gutterBottom>{strings.ACTION_TEXT}</Typography>
                    <Hr width={"90%"} />
                    <h4 style={{padding: "0 20px"}}>{strings.INSTRUCTION}</h4>
                </Grid>

                <Formik
                    initialValues= {{currentPassword: "", newPassword: "", confirmPassword: ""}}
                    validateOnChange={false}
                    validationSchema={validationSchema}
                    onSubmit={async (values, formState) =>{
                        console.log("I ama here")
                        formState.setSubmitting(true);
                    }}
                >
                    {({errors, touched, values, handleSubmit, isSubmitting, handleChange, handleBlur}) => (
                        isSubmitting ? (
                            <PLSpinner />
                        ):(
                            <Form>
                                <Grid>
                                    <TextField
                                        id={"currentPassword"}
                                        name="currentPassword"
                                        type="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.currentPassword}
                                        error={!!(errors.currentPassword && touched.currentPassword)}
                                        label={(errors.currentPassword && touched.currentPassword)?strings.TEXT_FIELD_ERROR_LABEL: ""}
                                        helperText={errors.currentPassword}
                                        placeholder={strings.PLACEHOLDER_TEXT1}
                                        size={"small"}
                                        variant="outlined"
                                        classes={{root: classes.textFieldRoot}}
                                    />
                                </Grid>
                                <Grid>
                                    <TextField
                                        id={"newPassword"}
                                        name={"newPassword"}
                                        type="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.newPassword}
                                        error={!!(errors.newPassword && touched.newPassword)}
                                        label={(errors.newPassword && touched.newPassword)?strings.TEXT_FIELD_ERROR_LABEL: ""}
                                        helperText={errors.newPassword}
                                        placeholder={strings.PLACEHOLDER_TEXT2}
                                        size={"small"}
                                        variant="outlined"
                                        classes={{root: classes.textFieldRoot}}
                                    />
                                </Grid>
                                <Grid>
                                    <TextField
                                        id={"confirmPassword"}
                                        name="confirmPassword"
                                        type="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.confirmPassword}
                                        error={!!(errors.confirmPassword && touched.confirmPassword)}
                                        label={(errors.confirmPassword && touched.confirmPassword)?strings.TEXT_FIELD_ERROR_LABEL: ""}
                                        helperText={errors.confirmPassword}
                                        placeholder={strings.PLACEHOLDER_TEXT3}
                                        size={"small"}
                                        variant="outlined"
                                        classes={{root: classes.textFieldRoot}}
                                    />
                                </Grid>
                                <Grid>
                                    <FormGroup row classes={{row: classes.formGroupRoot}}>
                                        <FormControlLabel
                                            control={
                                                <Button
                                                    type={"submit"}
                                                    variant={"contained"}
                                                    disabled={isSubmitting}
                                                    disableElevation
                                                    onSubmit={handleSubmit}
                                                    color={"primary"}
                                                >
                                                    Submit
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
        </React.Fragment>
    )
};

export default withFormSkeleton(InitialPasswordChange, "Login");
