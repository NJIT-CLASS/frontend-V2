import React from "react";
import {Table, TableBody, TableRow, TableCell} from "@material-ui/core"
import PLSelect from "../../../shared/PLSelect/PLSelect";
import PLInput from "../../../shared/PLInput/PLInput";
import PLButton from "../../../shared/PLButton/PLButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

class InviteAdministratorForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <form name="invite_admin" role="form" className="section" method="POST">
                <h2 className="title">Invite Administrator</h2>
                <div className="section-content">
                    <Table style={{maxWidth: 600}}>
                        {this.props.notification}
                        <TableBody>
                        <TableRow>
                            <TableCell>Email* </TableCell>
                            <TableCell>
                                <PLInput
                                    type="text"
                                    onChange={this.props.onFieldInput.bind(this,"addAdminUserData","email")}
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
                                    onChange={this.props.onFieldInput.bind(this,"addAdminUserData","fn")}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Last Name* </TableCell>
                            <TableCell>
                                <PLInput
                                    type="text"
                                    size={"small"}
                                    onChange={this.props.onFieldInput.bind(this,"addAdminUserData","ln")}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Organization </TableCell>
                            <TableCell>
                                <PLSelect
                                    onChange={this.props.onUpdateAdminOrg.bind(this)}
                                    value={this.props.addAdminUserData.organization}
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
                                    type={this.props.addAdminUserData.pwInputType}
                                    value={this.props.addAdminUserData.pw}
                                    onChange={this.props.onFieldInput.bind(this,"addAdminUserData","pw")}
                                />
                            </TableCell>
                            <TableCell>
                                <FormControlLabel
                                    control={<Checkbox checked={this.props.addAdminUserData.hidePW} onChange={this.props.onTogglePassword.bind(this, "addAdminUserData")} name="checkedA" />}
                                    label="hide"
                                />

                                <PLButton
                                    type="button"
                                    onClick={this.props.onGeneratePassword.bind(this,"addAdminUserData")}
                                >
                                    Generate Password
                                </PLButton>
                            </TableCell>
                        </TableRow>
                        {/*<tr><td/><td><button type="button" onClick={this.inviteAdmin.bind(this)}>Invite</button></td></tr>*/}
                        </TableBody>
                    </Table>
                </div>
            </form>
        )

    }

}

export default InviteAdministratorForm;