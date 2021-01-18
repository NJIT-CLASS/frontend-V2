import React from "react";
import {Table, TableBody, TableCell, TableRow} from "@material-ui/core";
import PLInput from "../../../shared/PLInput/PLInput";
import PLSelect from "../../../shared/PLSelect/PLSelect";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import PLButton from "../../../shared/PLButton/PLButton";

class CreateTestUserForm extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        const roleOptions = [
                {value:"Guest", label:"Guest"},
                {value:"Participant", label:"Participant"},
                {value:"Teacher",label:"Teacher"},
                {value:"Enhanced",label:"Enhanced"},
                {value:"Admin",label:"Admin"}
            ];

        return (
            <form name="invite_admin" role="form" className="section" method="POST">
                <h2 className="title">{this.props.header}</h2>
                {this.props.notification}
                <div className="section-content">
                    <Table style={{maxWidth: 600}}>
                        <TableBody>
                            <TableRow>
                                <TableCell>Email* </TableCell>
                                <TableCell>
                                    <PLInput
                                        type="text"
                                        onChange={this.props.onFieldInput.bind(this,"addTestUserData","email")}
                                        size={"small"}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>First Name* </TableCell>
                                <TableCell>
                                    <PLInput
                                        type="text"
                                        size={"small"}
                                        onChange={this.props.onFieldInput.bind(this,"addTestUserData","fn")}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Last Name* </TableCell>
                                <TableCell>
                                    <PLInput
                                        type="text"
                                        size={"small"}
                                        onChange={this.props.onFieldInput.bind(this,"addTestUserData","ln")}
                                    />
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>User Role* </TableCell>
                                <TableCell>
                                    <PLSelect
                                        value={this.props.addTestUserData.access}
                                        onChange={this.props.onUpdateTestUserRole.bind(this)}
                                        options={roleOptions}
                                    />
                                </TableCell>
                            </TableRow>


                            <TableRow>
                                <TableCell>Organization </TableCell>
                                <TableCell>
                                    <PLSelect
                                        onChange={this.props.onUpdateTestUserOrg.bind(this)}
                                        value={this.props.addTestUserData.organization}
                                        options={this.props.organizations.filter(o => !!o.label)}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Password* </TableCell>
                                <TableCell>
                                    <PLInput
                                        size={"small"}
                                        disabled={true}
                                        type={this.props.addTestUserData.pwInputType}
                                        value={this.props.addTestUserData.pw}
                                        onChange={this.props.onFieldInput.bind(this,"addTestUserData","pw")}
                                    />
                                </TableCell>
                                <TableCell>
                                    <FormControlLabel
                                        control={<Checkbox checked={this.props.addTestUserData.hidePW} onChange={this.props.onTogglePassword.bind(this, "addTestUserData")} />}
                                        label="hide"
                                    />

                                    <PLButton
                                        type="button"
                                        onClick={this.props.onGeneratePassword.bind(this,"addTestUserData")}
                                    >
                                        Generate Password
                                    </PLButton>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell />
                                <TableCell>
                                    <PLButton
                                        type="button"
                                        onClick={this.props.onAddUser.bind(this)}
                                        fullWidth
                                    >
                                        Add
                                    </PLButton>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </form>
        )
    }
}

export default CreateTestUserForm;