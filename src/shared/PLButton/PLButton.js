import React from "react";
import Button from "@material-ui/core/Button";

const PLButton = (props) => {
    return (
        <Button {...props} variant={"contained"} color={"primary"}>
            {props.children}
        </Button>
    )
};

export default PLButton;