import React from "react";
// Importing Utils
import {Link} from "react-router-dom";
import {Form, Formik} from "formik";
import strings from "./strings";
import * as Yup from "yup";
import Request from "../../utils/Request";
import connect from "react-redux/lib/connect/connect";
import * as actionTypes from "../../store/actions";
import makeStyles from "@material-ui/core/styles/makeStyles";
// Importing Material UI Components
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// Importing Custom Components
import PLTooltip from "../../shared/PLTooltip/PLTooltip";
import PLSpinner from "../../shared/PLSpinner/PLSpinner";
import Hr from "../../shared/Hr/Hr";
import HelpList from "./HelpList";

import withFormSkeleton from "../../HOC/withFormSkeleton/withFormSkeleton";
import Typography from "@material-ui/core/Typography";


const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email(strings.EMAIL_VALIDATION1)
        .required(strings.EMAIL_VALIDATION2),
    password: Yup.string()
        .required(strings.PASSWORD_VALIDATION1)
});

const useStyles = makeStyles((theme) => ({
    formGroupRoot: props => ({
        display: "flex",
        justifyContent: "space-around",
    }),

    textFieldRoot: props => ({
        width: "75%",
        marginBottom: "15px"
    }),

    tooltipTooltip: props => ({
        backgroundColor: "#e4e6e5",
        maxWidth: "600px",
        color: 'black'
    }),
}));

const Login = () => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Paper className={"paper"} elevation={3}>
                <Grid>
                    <PLTooltip
                        text={strings.TOOLTIP1}
                        placement={"top"}
                    >
                        <Typography variant={"h6"} gutterBottom>{strings.ACTION_TEXT}</Typography>
                    </PLTooltip>
                    <Hr width={"90%"} />
                </Grid>

                <Formik
                    initialValues= {{email: "", password: ""}}
                    validateOnChange={false}
                    validationSchema={validationSchema}
                    onSubmit={async (values, {setSubmitting, resetForm, ...formState}) =>{
                        setSubmitting(true);
                        try{
                            let postData = {
                                emailaddress: values.email,
                                password: values.password
                            }
                            const {response, data} = Request.post("/api/login", postData);
                            // console.log(response);
                            // console.log(data);
                            setSubmitting(false);
                            resetForm();
                        }catch (e) {

                        }
                    }}
                >
                    {({errors, touched, values, handleSubmit, isSubmitting, handleChange, handleBlur}) => (
                        isSubmitting ? (
                            <PLSpinner />
                        ):(
                            <Form>
                                <Grid>
                                    <PLTooltip placement={"right"} text={strings.TOOLTIP2}>
                                        <TextField
                                            id={"email"}
                                            name="email"
                                            type="text"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.email}
                                            error={!!(errors.email && touched.email)}
                                            label={(errors.email && touched.email)?strings.TEXT_FIELD_ERROR_LABEL: ""}
                                            helperText={errors.email}
                                            placeholder={strings.PLACEHOLDER_TEXT1}
                                            size={"small"}
                                            variant="outlined"
                                            classes={{root: classes.textFieldRoot}}
                                        />
                                    </PLTooltip>
                                </Grid>
                                <Grid>
                                    <PLTooltip placement={"right"} text={strings.TOOLTIP3}>
                                        <TextField
                                            id={"password"}
                                            name="password"
                                            type="password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.password}
                                            error={!!(errors.password && touched.password)}
                                            label={(errors.password && touched.password)?strings.TEXT_FIELD_ERROR_LABEL: ""}
                                            helperText={errors.password}
                                            placeholder={strings.PLACEHOLDER_TEXT2}
                                            size={"small"}
                                            variant="outlined"
                                            classes={{root: classes.textFieldRoot}}
                                        />
                                    </PLTooltip>
                                </Grid>
                                <Grid>
                                    <FormGroup row classes={{row: classes.formGroupRoot}}>
                                        <FormControlLabel
                                            control={<Checkbox onChange={handleChange} color={"primary"} name="checked" />}
                                            label={strings.CHECKBOX_TEXT}
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
                                                >
                                                    {strings.BUTTON_TEXT}
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
                <p>{strings.LINK_TEXT1_PART1}<Link to="/reset-password" className="link">{strings.LINK_TEXT1_PART2}</Link></p>
                <p>{strings.LINK_TEXT2_PART1}<Link to="/about" className="link">{strings.LINK_TEXT2_PART2}</Link></p>
                <PLTooltip placement={"right-end"} text={<HelpList />} classes={{tooltip: classes.tooltipTooltip}} arrow={false}>
                    <p><Link to="/" className="link">{strings.LINK_TEXT3_PART1}</Link></p>
                </PLTooltip>
            </Grid>
        </React.Fragment>
    )
};

const mapDispatchProps = (dispatch) => {
    return{
        addUser: (newUser) => dispatch({type: actionTypes.ADD_USER, user:newUser})
    }
};

const mapStateToProps = (state) => {
    return{
        user: state.user.user
    }
};

export default withFormSkeleton(Login, "Login");
