import React, {Component } from 'react';
import NumberField from './NumberField';
import PLCheckbox from "../../../shared/PLCheckbox/PLCheckbox";
import PLTooltip from "../../../shared/PLTooltip/PLTooltip";
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import PLSelect from "../../../shared/PLSelect/PLSelect";
import { isEmpty } from 'lodash';


class AllowAssessmentComponent extends Component{
    constructor(props){
        super(props);

        this.callTaskFunction = this.props.callTaskFunction.bind(this);
    }
    render(){
        let strings = this.props.Strings;
        const assessmentValues = [{ value: 'grade', label: strings.Grade }, { value: 'critique', label: strings.Critique }];
        const consolidationTypeValues = [{ value: 'max', label: strings.Max }, { value: 'min', label: strings.Min }, { value: 'avg', label: strings.Average }, { value: 'other', label: strings.Other }];
        const assigneeWhoValues = [{ value: 'student', label: strings.Student }, { value: 'instructor', label: strings.Instructor }, { value: 'both', label: strings.BothInstructorStudents }];

        if(this.props.TaskActivityData.TA_allow_follow_on_assessment === true){
            return (
                <div>
                    <div className="inner">
                        <label>{strings.AllowAnAssessment}</label>
                        <PLTooltip text={strings.TaskAllowAssessmentMessage} />
                        <span>{strings.AssessmentPlaceholder}</span>
                    </div>
                </div>
            );
        }

        let allowAssesmentOptions = null;
        let assessShowDispute = null;
        let assessConsolidateOptions = null;
        let assessShowConsol = null;
        let assessConstraint = null;
        let numberOfAssessView = null;
        let seeSibblingsView = null;
        const assessmentTask = this.props.callTaskFunction('getAssessmentTask', this.props.index, this.props.workflowIndex);

        if (assessmentTask != null && !isEmpty(assessmentTask) && this.props.TaskActivityData.TA_allow_follow_on_assessment !== true) {
            assessConstraint = assessmentTask['TA_assignee_constraints'][0];
            if(this.props.TaskActivityData.TA_allow_assessment !== 'none'){
                if(assessConstraint === 'student' || assessConstraint === 'both'){

                    if(this.callTaskFunction('getAssessNumberofParticipants', this.props.index, this.props.workflowIndex) > 1){

                        if(this.callTaskFunction('canConsolidate', this.props.index, this.props.workflowIndex, false)){
                            assessConsolidateOptions =
                                (
                                    <div>
                                        <label>{strings.GradingThreshold}</label>
                                        <PLTooltip text={strings.TaskConsolidateThresholdMessage} />
                                        <br />
                                        <RadioGroup
                                            value={this.callTaskFunction('getTriggerConsolidationRadioOption', this.props.index, this.props.workflowIndex, false)}
                                            onChange={(val) => {
                                                this.callTaskFunction('changeRadioData', 'TA_trigger_consolidation_threshold_assess', this.props.index, this.props.workflowIndex, val);
                                                const newGrades = this.state.GradingThreshold;
                                                newGrades[1] = val;
                                                this.setState({ GradingThreshold: newGrades });
                                            }}
                                        >
                                            <FormControlLabel value="points" control={<Radio />} label={strings.Points} />
                                            <FormControlLabel value="percent" control={<Radio />} label={strings.Percent} />
                                        </RadioGroup>
                                        <br />
                                        <NumberField value={this.callTaskFunction('getTriggerConsolidationThreshold', this.props.index, this.props.workflowIndex, false)} min={0} max={100} onChange={this.props.callTaskFunction.bind(this, 'changeNumericData', 'TA_trigger_consolidation_threshold_assess', this.props.index, this.props.workflowIndex)} size={6} />
                                        <br />
                                        <label>{strings.ToBeConsolidatedAssessment}</label>
                                        <PLTooltip text={strings.TaskConsolidateFunctionMessage} />
                                        <PLSelect
                                            options={consolidationTypeValues}
                                            value={this.callTaskFunction('getConsolidateValue', this.props.index, this.props.workflowIndex, true)}
                                            onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'TA_function_type_Assess', this.props.index, this.props.workflowIndex)}
                                        />
                                    </div>
                                );
                        }

                        assessShowConsol = (
                            <div>
                                <label>{strings.ShouldAssessmentsBeConsolidated}</label>
                                <PLTooltip text={strings.TaskCanConsolidateMessage} />
                                <PLCheckbox onChange={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'Assess_Consolidate', this.props.index, this.props.workflowIndex)} checked={this.props.callTaskFunction('canConsolidate', this.props.index, this.props.workflowIndex, false)} />

                            </div>
                        );

                        seeSibblingsView = (
                            <div>
                                <label>{strings.SeeSibblingsInParent}</label>
                                <PLTooltip text={strings.TaskSeeSibblingsMessage} />
                                <PLCheckbox
                                    onChange={this.props.callTaskFunction.bind(this, 'setSeeSibblings', this.props.index, this.props.workflowIndex, true)}
                                    checked={this.props.callTaskFunction('getSeeSibblings', this.props.index, this.props.workflowIndex, true)}
                                />
                            </div>
                        );
                    }

                    numberOfAssessView = (
                        <div>
                            <br />
                            <label>{strings.NumberOfAssessors}</label>
                            <PLTooltip text={strings.TaskAssessmentNumberOfParticipantsMessage} />
                            <br />
                            <NumberField value={this.props.callTaskFunction('getAssessNumberofParticipants', this.props.index, this.props.workflowIndex)} min={1} max={20} onChange={this.props.callTaskFunction.bind(this, 'setAssessNumberofParticipants', this.props.index, this.props.workflowIndex)} />
                            <br />
                            <div className="inner">
                            </div>
                        </div>
                    );
                }

                assessShowDispute = (
                    <div>
                        <label>{strings.CanStudentsDisputeAssessment}</label>
                        <PLTooltip text={strings.TaskCanDisputeMessage} />
                        <PLCheckbox
                            checked={this.callTaskFunction('canDispute', this.props.index, this.props.workflowIndex, false)}
                            onChange={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'Assess_Dispute', this.props.index, this.props.workflowIndex)}
                        />
                    </div>
                );

                allowAssesmentOptions =
                    (
                        <div>
                            <PLSelect options={assessmentValues} onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'TA_allow_assessment', this.props.index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_allow_assessment}/>
                            <label>{strings.WhoCanAssess}</label>
                            <PLTooltip text={strings.TaskWhoCanAssessMessage} />
                            <br />
                            <PLSelect options={assigneeWhoValues} value={this.props.callTaskFunction('getAssigneeInChild', false, this.props.index, this.props.workflowIndex)} onChange={this.props.callTaskFunction.bind(this, 'changeAssigneeInChild', false, this.props.index, this.props.workflowIndex)} />
                        </div>
                    );
            }

        }

        const allowAssessment = (
            <div>
                <div className="inner">
                    <label>{strings.AllowAnAssessment}</label>
                    <PLTooltip text={strings.TaskAllowAssessmentMessage}  />
                    <PLCheckbox
                        onChange={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'TA_allow_assessment', this.props.index, this.props.workflowIndex)}
                        checked={this.props.TaskActivityData.TA_allow_assessment !== 'none'}
                    />
                    {allowAssesmentOptions}
                </div>
                <div className="inner">
                    {numberOfAssessView}
                    {assessShowConsol}
                    {assessConsolidateOptions}
                </div>
                <div className="inner">
                    {seeSibblingsView}
                    {assessShowDispute}
                </div>
            </div>
        );
        return allowAssessment;
    }
}

export default AllowAssessmentComponent;