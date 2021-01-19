import React from "react";
import {Table, TableBody, TableRow, TableCell} from "@material-ui/core"
import PLSelect from "../../../shared/PLSelect/PLSelect";
import PLInput from "../../../shared/PLInput/PLInput";
import PLButton from "../../../shared/PLButton/PLButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

export default function InviteAdministratorForm(props) {
    return (
        <form name="invite_admin" role="form" className="section" method="POST">
            <h2 className="title">{props.header}</h2>
            <div className="section-content">
                {props.notification}
                <Table style={{maxWidth: 600}}>
                    <TableBody>
                        <TableRow>
                            <TableCell>Email* </TableCell>
                            <TableCell>
                                <PLInput
                                    type="text"
                                    onChange={props.onFieldInput.bind(this,"addAdminUserData","email")}
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
                                    onChange={props.onFieldInput.bind(this,"addAdminUserData","fn")}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Last Name* </TableCell>
                            <TableCell>
                                <PLInput
                                    type="text"
                                    size={"small"}
                                    onChange={props.onFieldInput.bind(this,"addAdminUserData","ln")}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Organization </TableCell>
                            <TableCell>
                                <PLSelect
                                    onChange={props.onUpdateAdminOrg.bind(this)}
                                    value={props.addAdminUserData.organization}
                                    options={props.organizations.filter(o => !!o.label)}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Password* </TableCell>
                            <TableCell>
                                <PLInput
                                    size={"small"}
                                    disabled={true}
                                    type={props.addAdminUserData.pwInputType}
                                    value={props.addAdminUserData.pw}
                                    onChange={props.onFieldInput.bind(this,"addAdminUserData","pw")}
                                />
                            </TableCell>
                            <TableCell>
                                <FormControlLabel
                                    control={<Checkbox checked={props.addAdminUserData.hidePW} onChange={props.onTogglePassword.bind(this, "addAdminUserData")} name="checkedA" />}
                                    label="hide"
                                />

                                <PLButton
                                    type="button"
                                    onClick={props.onGeneratePassword.bind(this,"addAdminUserData")}
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
                                    onClick={props.onInviteAdmin.bind(this)}
                                    fullWidth
                                >
                                    Invite
                                </PLButton>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </form>
    )
}