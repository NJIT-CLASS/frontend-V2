import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import FormControl from "@material-ui/core/FormControl";
import React from "react";

const ExtraCreditSection = (props) => {
    return (
        <FormControl component="fieldset">
            <FormLabel component="legend" focused={false}>Replacement users receive:</FormLabel>
            <RadioGroup value={String(props.extraCredit)} onChange={props.onChange}>
                <FormControlLabel value={"true"} control={<Radio color={"primary"} />} label="Extra credit" />
                <FormControlLabel value={"false"} control={<Radio color={"primary"} />} label="No extra credit" />
            </RadioGroup>
        </FormControl>
    )

};

export default ExtraCreditSection;