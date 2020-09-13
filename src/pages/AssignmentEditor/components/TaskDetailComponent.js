import React from 'react';
import PLSelect from "../../../shared/PLSelect/PLSelect";
import { Editor } from '@tinymce/tinymce-react';
import tinymceOptions from './tinymceOptions';
import PLCheckbox from "../../../shared/PLCheckbox/PLCheckbox";
import NumberField from './NumberField';
import PLToggleSwitch from "../../../shared/PLToggleSwitch/PLToggleSwitch";
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import PLTooltip from "../../../shared/PLTooltip/PLTooltip";

import TaskDisplayName from './TaskDisplayName';
import AllowAssessmentComponent from './AllowAssessmentComponent';
import AllowFollowOnAssessmentComponent from './AllowFollowOnAssessmentComponent';
import PLInput from "../../../shared/PLInput/PLInput";
import PLButton from "../../../shared/PLButton/PLButton";
import Rating from "@material-ui/lab/Rating";

//Initial state, needed to maintain across mount and unmount

let state = {
    NewTask: true,
    FieldType: 'text',
    Tasks: [
        {
            AtDurationEnd: '',
            WhatIfLate: '',
            Reflection: ['none', null],
        },
    ],
    SimpleGradePointReduction: 0,
    CurrentFieldSelection: null,
    GradingThreshold: [
        '', '',
    ],
    DefaultFieldForeign: [false], // will be true if want to show Def Content from other tasks
    CurrentTaskFieldSelection: 0,
    ShowAssigneeConstraintSections: [
        false, false, false, false,
    ], // same as, in same group as, not in, choose from
    ShowAdvanced: false,
    ShowTaskLevelParams: true,
    ShowUserFields: true,
};

class TaskDetailsComponent extends React.Component {

    // PROPS:
    //  - all the methods
    //  - index, TaskActivityData, Opened

    constructor(props) {
        super(props);

        this.state = state;

        this.callTaskFunction = this.props.callTaskFunction.bind(this);
        this.toggleAdvanced = this.toggleAdvanced.bind(this);
        this.toggleUserFields = this.toggleUserFields.bind(this);
        this.toggleTaskParams = this.toggleTaskParams.bind(this);
    }

    componentWillUnmount() {
        state = this.state;
    }

    isAssigneeConstraintChecked(constraint, taskID) {
        const constraintArray = this.props.TaskActivityData.TA_assignee_constraints[2];

        if (constraintArray === undefined || constraintArray[constraint] === undefined) {
            return false;
        }
        return !!constraintArray[constraint].includes(taskID);
    }

    doesTaskHaveAssessmentFields() {
        let hasAssessment = false;
        this.props.TaskActivityData.TA_fields.field_titles.forEach((field, index) => {
            if (this.props.TaskActivityData.TA_fields[index].field_type === 'assessment' || this.props.TaskActivityData.TA_fields[index].assessment_type === 'self assessment') {
                hasAssessment = true;
            }
        });
        return hasAssessment;
    }
    showAssigneeSection(key) {
        return this.props.TaskActivityData.TA_assignee_constraints[2][key] !== undefined;

    }

    toggleUserFields(){
        this.setState({
            ShowUserFields: !this.state.ShowUserFields
        });
    }
    toggleAdvanced(){
        this.setState({
            ShowAdvanced: !this.state.ShowAdvanced
        });
    }
    toggleTaskParams(){
        this.setState({
            ShowTaskLevelParams: !this.state.ShowTaskLevelParams
        });
    }

    mapFieldDistToOptions(){
        if(this.props.TaskActivityData.TA_fields.field_distribution === undefined){
            return [];
        }
        return Object.keys(this.props.TaskActivityData.TA_fields.field_distribution).map(function(field){
            return {id: field, name: this.props.TaskActivityData.TA_fields[field].title, weight: this.props.TaskActivityData.TA_fields.field_distribution[field]};
        },this);


    }

    render() {
        const strings = this.props.Strings;
        const fieldTypeValues = [{ value: 'text', label: strings.TextInput }, { value: 'numeric', label: strings.Numeric }, { value: 'assessment', label: strings.Assessment }, { value: 'self assessment', label: strings.SelfAssessment }];
        const assessmentTypeValues = [{ value: 'grade', label: strings.NumericGrade }, { value: 'rating', label: strings.Rating }, { value: 'pass', label: strings.PassFail }, { value: 'evaluation', label: strings.EvaluationByLabels }];
        const onTaskEndValues = [{ value: 'late', label: strings.Late }/*, { value: 'resolved', label: strings.Resolved }, { value: 'abandon', label: strings.Abandon }, { value: 'complete', label: strings.Complete }*/];
        const onLateValues = [{ value: 'keep_same_participant', label: strings.KeepSameParticipant }, { value: 'allocate_new_participant_from_contigency_pool', label: strings.AllocateNewParticipant }, { value: 'allocate_to_instructor', label: strings.AllocateToInstructor }, /*{ value: 'allocate_to different_person_in_same_group', label: strings.AllocateToDifferentGroupMember },*/ {value: 'allocate_new_participant_extra_credit', label: strings.AllocateExtraCredit}];
        const reflectionValues = [{ value: 'edit', label: strings.Edit }, { value: 'comment', label: strings.CommentText }];
        // const assessmentValues = [{ value: 'grade', label: strings.Grade }, { value: 'critique', label: strings.Critique }];
        const assigneeWhoValues = [{ value: 'student', label: strings.Student }, { value: 'instructor', label: strings.Instructor }/*, { value: 'both', label: strings.BothInstructorStudents }*/];
        // const consolidationTypeValues = [{ value: 'max', label: strings.Max }, { value: 'min', label: strings.Min }, { value: 'avg', label: strings.Average }/*, { value: 'other', label: strings.Other }*/];
        const versionEvaluationValues = [{ value: 'first', label: strings.First }, { value: 'last', label: strings.Last }, { value: 'whole', label: strings.WholeProcess }];
        // const reflectWaitValues = [{value: 'wait', label: 'Wait'},{ value: 'don\'t wait', label: 'Don\'t Wait'}];

        const title = this.props.TaskActivityData.TA_display_name;

        if (!this.props.isOpen) {
            return (
                <div className="section card-1" key={`Mini View of Task ${this.props.index}`}>
                    <h2 className="title" onClick={this.props.changeSelectedTask.bind(this, this.props.index)}>{title}</h2>
                </div>
            );
        }

        const taskCreatedList = this.props.callTaskFunction('getAlreadyCreatedTasks', this.props.index, this.props.workflowIndex);
        const simpleGradeOptionsView = null;

        // assignee constraint views
        const sameAsOptions = null;
        const inSameGroupAsOptions = null;
        const notInOptions = null;
        const chooseFromOptions = null;
        const assigneeRelations = null;

        let taskLevelParameters = (
            <div key={`Task-level Params for ${this.props.index} in ${this.props.workflowIndex}`} className="section card-2">
                <h2 className="title" onClick={this.toggleTaskParams}>{strings.TaskHeader}
                    <span className="fa fa-angle-down" style={{float: 'right'}}/>
                </h2>
            </div>
        );
        if(this.state.ShowTaskLevelParams){
            // TA_display_name
            const displayName = (
                <TaskDisplayName workflowIndex={this.props.workflowIndex}
                                 index={this.props.index}
                                 value={this.props.TaskActivityData.TA_display_name}
                                 strings={strings}
                                 callTaskFunction={this.callTaskFunction}
                />

            );

            // TA_file_upload
            const fileUploadOptions = this.props.TaskActivityData.AllowFileUpload
                ? (
                    <div
                        style={{
                            display: 'inline-block',
                        }}
                    >
                        <div className="inner">
                            <label>
                                {strings.HowManyRequiredFiles}</label>
                            <PLTooltip text={strings.TaskRequiredFilesMessage} />
                            <br />
                            <NumberField
                                min={0}
                                max={10}
                                onChange={this.props.callTaskFunction.bind(this, 'changeFileUpload', 'mandatory', this.props.index, this.props.workflowIndex)}
                                value={this.props.TaskActivityData.TA_file_upload.mandatory}
                            />
                        </div>
                        <div className="inner">
                            <label>
                                {strings.MaximumNumberOfOptionalFiles}
                            </label>
                            <PLTooltip text={strings.TaskOptionalFilesMessage} />
                            <br />
                            <NumberField
                                min={0}
                                max={10}
                                onChange={this.props.callTaskFunction.bind(this, 'changeFileUpload', 'optional', this.props.index, this.props.workflowIndex)}
                                value={this.props.TaskActivityData.TA_file_upload.optional}
                            />
                        </div>
                    </div>
                )
                : null;
            const fileUploads = (
                <div className="inner">
                    <label>{strings.AreAnyFileUploadsRequired}</label>
                    <PLCheckbox
                        checked={this.props.TaskActivityData.AllowFileUpload}
                        onChange={() => {
                            console.log('Clicked file upload', this.props.index, this.props.workflowIndex);
                            this.props.callTaskFunction('changeDataCheck', 'AllowFileUpload', this.props.index, this.props.workflowIndex);
                        }}
                    />
                    {fileUploadOptions}
                </div>
            );

            // TA_overall_instructions
            const taskInstructions = (
                <div className="inner block">
                    <label>{strings.TaskInstructions}</label>
                    <PLTooltip text={strings.TaskInstructionsMessage}  />
                    <Editor
                        initialValue={this.props.TaskActivityData.TA_overall_instructions}
                        init={tinymceOptions}
                        onChange={this.props.callTaskFunction.bind(this, 'changeInputData', 'TA_overall_instructions', this.props.index, this.props.workflowIndex)}
                    />
                </div>

            );

            // TA_overall_rubric
            const taskRubric = (
                <div className="inner block">
                    <label>{strings.TaskRubric}</label>
                    <PLTooltip text={strings.TaskRubricMessage} />
                    <Editor
                        initialValue={this.props.TaskActivityData.TA_overall_rubric}
                        init={tinymceOptions}
                        onChange={this.props.callTaskFunction.bind(this, 'changeInputData', 'TA_overall_rubric', this.props.index, this.props.workflowIndex)}
                    />
                </div>
            );

            taskLevelParameters = (
                <div key={`Task-level Params for ${this.props.index} in ${this.props.workflowIndex}`} className="section card-2">
                    <h2 className="title" onClick={this.toggleTaskParams}>
                        {strings.TaskHeader}
                        <span className="fa fa-angle-up" style={{float: 'right'}}/>
                    </h2>
                    <div className="section-content">
                        {displayName}
                        {fileUploads}
                        {taskInstructions}
                        {taskRubric}
                    </div>
                </div>
            );
        }

        // inputFields

        const inputFields = [];
        Object.keys(this.props.TaskActivityData.TA_fields).forEach(function (index) {
            if(isNaN(index)){
                return;
            }
            let assessmentTypeView = null; // options that change on assessment type selection
            let defaultContentView;
            const showDefaultFromOthers = taskCreatedList.length > 0;
            let defaultContentButton;

            const justificationView = (this.props.TaskActivityData.TA_fields[index].requires_justification)
                ? (
                    <div className="inner block" key={index + 200}>
                        <label>{strings.FieldJustificationInstructions}</label>
                        <PLTooltip text={strings.TaskFieldJustificationInstructionsMessage}/>
                        <Editor
                            initialValue={this.props.TaskActivityData.TA_fields[index].justification_instructions}
                            init={tinymceOptions}
                            onChange={this.props.callTaskFunction.bind(this, 'changeInputFieldData', 'justification_instructions', this.props.index, index, this.props.workflowIndex)}
                        />
                    </div>
                )
                : null; // justification textbox for the field

            let fieldTypeOptions = null; // options that change on Field Type dropbox selection

            if (this.props.TaskActivityData.TA_fields[index].field_type === 'numeric') {
                fieldTypeOptions = (
                    <div>
                        <label>{strings.Min}</label>
                        <NumberField
                            min={-10000}
                            max={10000}
                            value={this.props.TaskActivityData.TA_fields[index].numeric_min}
                            onChange={this.props.callTaskFunction.bind(this, 'changeNumericFieldData', 'numeric_min', this.props.index, index, this.props.workflowIndex)}
                        />
                        <br />
                        <label>{strings.Max}</label>
                        <NumberField
                            value={this.props.TaskActivityData.TA_fields[index].numeric_max}
                            min={-10000}
                            max={10000}
                            onChange={this.props.callTaskFunction.bind(this, 'changeNumericFieldData', 'numeric_max', this.props.index, index, this.props.workflowIndex)}
                        />
                    </div>
                );
            } else if (this.props.TaskActivityData.TA_fields[index].field_type === 'assessment' || this.props.TaskActivityData.TA_fields[index].field_type === 'self assessment') {
                if (this.props.TaskActivityData.TA_fields[index].assessment_type === 'grade') {
                    assessmentTypeView = (
                        <div>
                            <label>{strings.Min}</label>
                            <NumberField
                                min={0}
                                max={100}
                                value={this.props.TaskActivityData.TA_fields[index].numeric_min}
                                onChange={this.props.callTaskFunction.bind(this, 'changeNumericFieldData', 'numeric_min', this.props.index, index, this.props.workflowIndex)}
                            />
                            <label>{strings.Max}</label>
                            <NumberField
                                value={this.props.TaskActivityData.TA_fields[index].numeric_max}
                                min={-10000}
                                max={10000}
                                onChange={this.props.callTaskFunction.bind(this, 'changeNumericFieldData', 'numeric_max', this.props.index, index, this.props.workflowIndex)}
                            />
                        </div>
                    );
                } else if (this.props.TaskActivityData.TA_fields[index].assessment_type === 'rating') {
                    assessmentTypeView = (<div>
                        <label>{strings.MaxRatingLabel}</label>
                        <NumberField
                            value={this.props.TaskActivityData.TA_fields[index].rating_max}
                            min={-10000}
                            max={10000}
                            onChange={this.props.callTaskFunction.bind(this, 'changeNumericFieldData', 'rating_max', this.props.index, index, this.props.workflowIndex)}
                        />
                    </div>);
                } else if (this.props.TaskActivityData.TA_fields[index].assessment_type === 'evaluation') {
                    assessmentTypeView = (<div>
                        <label>{strings.EvaluationByLabelsLabel}</label><br/>
                        <PLTooltip text={strings.TaskFieldEvalByLabelsMessage} />
                        <PLInput
                            value={this.props.TaskActivityData.TA_fields[index].list_of_labels.join(',')}
                            onChange={this.props.callTaskFunction.bind(this, 'setEvaluationByLabels', this.props.index, index, this.props.workflowIndex)}
                        />
                    </div>);
                }

                fieldTypeOptions = (
                    <div>
                        <label>{strings.AssessmentType}</label>
                        <PLTooltip text={strings.TaskAssessmentTypeMessage} />
                        <br />
                        <PLSelect
                            key={index + 300}
                            options={assessmentTypeValues}
                            onChange={this.props.callTaskFunction.bind(this, 'changeDropdownFieldData', 'assessment_type', this.props.index, index, this.props.workflowIndex)}
                            value={this.props.TaskActivityData.TA_fields[index].assessment_type} searchable={false} clearable={false}
                        />
                        <br />
                        {assessmentTypeView}
                    </div>
                );
            }
            // Default Content from Other Tasks Logic
            if (showDefaultFromOthers && this.props.callTaskFunction('isDefaultFieldRefersToToggled', index, this.props.index, this.props.workflowIndex)) {
                const defaultParentTaskId = this.props.callTaskFunction('getFieldDefaultContentValue', 0, index, this.props.index, this.props.workflowIndex);
                const fieldSelectionList = this.props.callTaskFunction('getTaskFields', defaultParentTaskId, this.props.workflowIndex).map(field => {
                    let parentId = field.value.split(':')[0];
                    if(parentId !== defaultParentTaskId){
                        // TODO MAYBE A PROBLEM
                        return <label>
                            <FormControlLabel value={field.value} control={<Radio />} label={field.label} />
                            <span className="faded-message-text">({strings.DefaultContentLinked})</span>
                        </label>;
                    }
                    return <FormControlLabel value={field.value} control={<Radio />} label={field.label} />
                });
                const fieldSelection = (
                    <RadioGroup
                        value={this.props.callTaskFunction('getFieldDefaultContentValue', 1,index, this.props.index, this.props.workflowIndex )}
                        key={`taskFieldDefault${1}`}
                        onChange={(value) => {
                            this.setState({ CurrentFieldSelection: value });
                            this.props.callTaskFunction('setDefaultField', 1, index, this.props.index, this.props.workflowIndex, value);
                        }}
                    >
                        {fieldSelectionList}
                    </RadioGroup>
                );

                const defaultContentWrapper = (
                    <div>
                        <RadioGroup
                            key={`taskFieldDefault${2}`}
                            value={defaultParentTaskId}
                            onChange={(value) => {
                                this.setState({ CurrentTaskFieldSelection: value, CurrentFieldSelection: 0 });

                                this.props.callTaskFunction('setDefaultField', 0, index, this.props.index, this.props.workflowIndex, value);
                            }}
                        >
                            {taskCreatedList.map(task => (
                                <FormControlLabel value={task.value} control={<Radio />} label={task.label} />
                            ), this)
                            }
                        </RadioGroup>
                    </div>
                );

                defaultContentView = (
                    <div className="inner block">
                        <label>{strings.DefaultContentFromOtherTasks}</label>
                        <PLTooltip text={strings.TaskDefaultFieldContentFromOthersMessage}  />
                        {defaultContentWrapper}
                        {fieldSelection}
                    </div>
                );

            } else  if(this.props.TaskActivityData.TA_fields[index].field_type === 'assessment' || this.props.TaskActivityData.TA_fields[index].field_type === 'self assessment' ){
                switch(this.props.TaskActivityData.TA_fields[index].assessment_type){

                    case 'grade':
                        defaultContentView = (
                            <div className="inner block">
                                <label>{strings.DefaultContentForField}</label>
                                <PLTooltip text={strings.TaskDefaultFieldContentMessage} />
                                <PLInput
                                    className="number-input"
                                    placeholder=""
                                    onChange={this.props.callTaskFunction.bind(this, 'changeInputFieldData', 'default_content', this.props.index, index, this.props.workflowIndex)}
                                    value={this.props.TaskActivityData.TA_fields[index].default_content[0]}
                                />
                            </div>
                        );
                        break;
                    case 'rating':
                        defaultContentView = (
                            <div className="inner block">
                                <label>{strings.DefaultContentForField}</label>
                                <PLTooltip text={strings.TaskDefaultFieldContentMessage} />
                                <Rating
                                    value={this.props.TaskActivityData.TA_fields[index].default_content[0]}
                                    max={this.props.TaskActivityData.TA_fields[index].rating_max}
                                    onChange={(event, val) => {
                                        this.props.callTaskFunction('changeInputFieldData', 'default_content', this.props.index, index, this.props.workflowIndex, val.rating);
                                    }}
                                />
                            </div>
                        );
                        break;
                    case 'evaluation':
                        let labels = this.props.TaskActivityData.TA_fields[index].list_of_labels;
                        if (typeof labels === 'string') {
                            labels = labels.split(',');
                        }
                        labels = labels.map(label => {
                            return {value: label, label: label};
                        });

                        defaultContentView = (
                            <div className="inner block">
                                <label>{strings.DefaultContentForField}</label>
                                <PLTooltip text={strings.TaskDefaultFieldContentMessage} />
                                <PLSelect
                                    key={index + 1000}
                                    options={labels}
                                    defaultValue={this.props.TaskActivityData.TA_fields[index].default_content[0]}
                                    value={this.props.TaskActivityData.TA_fields[index].default_content[0]}
                                    onChange={(val) => {
                                        this.props.callTaskFunction('changeInputFieldData', 'default_content', this.props.index, index, this.props.workflowIndex, val.value);
                                    }}
                                />
                            </div>
                        );
                        break;
                    case 'pass':
                        defaultContentView = (
                            <div className="true-checkbox">
                                <label>{strings.DefaultContentForField}</label>
                                <PLTooltip text={strings.TaskDefaultFieldContentMessage} />
                                <RadioGroup
                                    value={this.props.TaskActivityData.TA_fields[index].default_content[0]}
                                    onChange={(val) => {
                                        this.props.callTaskFunction('changeInputFieldData', 'default_content', this.props.index, index, this.props.workflowIndex, val);
                                    }}
                                >
                                    <FormControlLabel value={'pass'} control={<Radio />} label={strings.Pass} />
                                    <FormControlLabel value={'fail'} control={<Radio />} label={strings.Fail} />
                                </RadioGroup>
                            </div>
                        );
                        break;
                    default:
                        defaultContentView = (
                            <div className="inner block">
                                <label>{strings.DefaultContentForField}</label>
                                <PLTooltip text={strings.TaskDefaultFieldContentMessage} />
                                <Editor
                                    initialValue={this.props.TaskActivityData.TA_fields[index].default_content[0]}
                                    init={tinymceOptions}
                                    onChange={this.props.callTaskFunction.bind(this, 'changeInputFieldData', 'default_content', this.props.index, index, this.props.workflowIndex)}
                                />
                            </div>
                        );
                        break;
                }
            } else {
                defaultContentView = (
                    <div className="inner block">
                        <label>{strings.DefaultContentForField}</label>
                        <PLTooltip text={strings.TaskDefaultFieldContentMessage} />
                        <Editor
                            initialValue={this.props.TaskActivityData.TA_fields[index].default_content[0]}
                            init={tinymceOptions}
                            onChange={this.props.callTaskFunction.bind(this, 'changeInputFieldData', 'default_content', this.props.index, index, this.props.workflowIndex)}
                        />
                    </div>
                );
            }

            defaultContentButton = (
                <div
                    style={{
                        display: 'inline',
                    }}
                >
                    <label>{strings.GetDataFromAnotherTaskInstead}</label>
                    <PLTooltip text={strings.TaskGetFieldContentMessage} />
                    <PLCheckbox
                        checked={this.props.callTaskFunction('isDefaultFieldRefersToToggled', index, this.props.index, this.props.workflowIndex)}
                        onChange={() => {
                            this.props.callTaskFunction('toggleDefaultFieldRefersTo', index, this.props.index, this.props.workflowIndex);
                        }}
                    />
                </div>
            );

            let removeButtonView = null;
            if (index !== 0) {
                removeButtonView = (<div className="remove-button" onClick={this.props.callTaskFunction.bind(this, 'removeFieldButton', this.props.index, this.props.workflowIndex, index)}>
                    <PLTooltip text={strings.RemoveButtonTip}>
                        <i className="fa fa-remove" />
                    </PLTooltip>
                </div>);
            }

            inputFields.push(
                <div
                    className="section-divider" key={`Task ${this.props.index} of Workflow
                  ${this.props.workflowIndex} Field ${index}`}
                >
                    <h3 className="subheading">{this.props.TaskActivityData.TA_fields[index].title}
                        {removeButtonView}
                    </h3>

                    <div className="inner">
                        <label>{strings.FieldName}</label>
                        <br />
                        <PLInput
                            placeholder="Field Name"
                            value={this.props.TaskActivityData.TA_fields[index].title}
                            onChange={this.props.callTaskFunction.bind(this, 'changeFieldName', this.props.index, index, this.props.workflowIndex)}
                        />
                    </div>

                    <div className="inner">
                        <label>
                            {strings.ShowThisName}?
                        </label>
                        <PLTooltip text={strings.TaskShowFieldNameMessage} />
                        <br />
                        <PLCheckbox
                            checked={this.props.TaskActivityData.TA_fields[index].show_title}
                            onChange={this.props.callTaskFunction.bind(this, 'changeFieldCheck', 'show_title', this.props.index, index, this.props.workflowIndex)}
                        />
                    </div>

                    <div className="inner">
                        <label>{strings.FieldType}</label>
                        <PLTooltip text={strings.TaskFieldTypeMessage}/>
                        <br />

                        <PLSelect
                            key={index}
                            options={fieldTypeValues}
                            onChange={this.props.callTaskFunction.bind(this, 'changeDropdownFieldData', 'field_type', this.props.index, index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_fields[index].field_type}
                        />
                        <br />
                        {fieldTypeOptions}
                    </div>

                    <div className="inner">
                        <label>{strings.RequiresJustification} ?</label>
                        <PLTooltip text={strings.TaskRequiresJustificationMessage} />
                        <br />
                        <PLCheckbox
                            onChange={this.props.callTaskFunction.bind(this, 'changeFieldCheck', 'requires_justification', this.props.index, index, this.props.workflowIndex)}
                            checked={this.props.TaskActivityData.TA_fields[index].requires_justification}
                        />
                    </div>

                    <div className="inner block">
                        <label>{strings.FieldInstructions} ({strings.Optional})</label>
                        <PLTooltip text={strings.TaskFieldInstructionsMessage}/>
                        <Editor
                            initialValue={this.props.TaskActivityData.TA_fields[index].instructions}
                            init={tinymceOptions}
                            onChange={this.props.callTaskFunction.bind(this, 'changeInputFieldData', 'instructions', this.props.index, index, this.props.workflowIndex)}
                        />
                    </div>

                    <div className="inner block">
                        <label>{strings.FieldRubric}</label>
                        <PLTooltip text={strings.TaskFieldRubricMessage}/>
                        <Editor
                            initialValue={this.props.TaskActivityData.TA_fields[index].rubric}
                            init={tinymceOptions}
                            onChange={this.props.callTaskFunction.bind(this, 'changeInputFieldData', 'rubric', this.props.index, index, this.props.workflowIndex)}
                        />
                    </div>

                    {justificationView}
                    <br />
                    {defaultContentView}
                    {defaultContentButton}
                    <br />
                    <br />
                </div>
            );
        }, this);

        const fieldButton = (
            <div className="section-button-area">
                <PLButton
                   className="divider"
                   onClick={() => {
                        this.props.callTaskFunction('addFieldButton', this.props.index, this.props.workflowIndex);
                        const newDefFields = this.state.DefaultFieldForeign;
                        newDefFields.push(false);
                        this.setState({ DefaultFieldForeign: newDefFields });
                    }}
                >
                    <i className="fa fa-check" />
                    {strings.AddAnotherField}
                </PLButton>
            </div>
        );

        // const toggleView = (
        //     <div className="section-button-area">
        //         <label
        //             style={{
        //                 display: 'inline-block'
        //             }}
        //         >{strings.ShowAdvancedOptions}?</label>
        //         <br />
        //         <PLToggleSwitch
        //             checked={this.state.ShowAdvanced}
        //             onChange={() => {
        //                 this.setState({
        //                     ShowAdvanced: !this.state.ShowAdvanced,
        //                 });
        //             }}
        //         />
        //     </div>
        // );

        let advancedOptionsView = (
            <div key={`Advanced Task-level Parameters for ${this.props.index} in ${this.props.workflowIndex}`} className="section card-2">
                <h2 className="title" onClick={this.toggleAdvanced}>{strings.AdvancedTaskParamHeader}
                    <span className={'fa fa-angle-down'} style={{float: 'right'}}/>
                </h2>
            </div>);
        if (this.state.ShowAdvanced) {
            const firstAssigneeConstr = this.props.TaskActivityData.TA_assignee_constraints[0];

            const dueType = (
                <div className="inner">

                    <label>{strings.DefaultTaskDuration}</label>
                    <NumberField
                        label={strings.Days}
                        value={this.props.TaskActivityData.TA_due_type[1] / 1440}
                        min={1}
                        max={100}
                        onChange={this.props.callTaskFunction.bind(this, 'changeNumericData', 'TA_due_type', this.props.index, this.props.workflowIndex)}
                    />

                    <label>{strings.ShouldTaskEndAtCertainTime}</label>
                    <PLTooltip text={strings.TaskDueTypeMessage} />

                    <br />
                    <RadioGroup
                        value={this.props.TaskActivityData.TA_due_type[0]}
                        onChange={this.props.callTaskFunction.bind(this, 'changeRadioData', 'TA_due_type', this.props.index, this.props.workflowIndex)}
                    >
                        <FormControlLabel value={'duration'} control={<Radio />} label={strings.ExpireAfter} />
                        <FormControlLabel value={'specific time'} control={<Radio />} label={strings.EndAtThisTime} />
                    </RadioGroup>
                </div>
            );

            // TODO CHECK THIS TRUE FALSE
            const startDelay = (
                <div className="inner">
                    <label>{strings.DelayBeforeStartingTask}</label>
                    <PLTooltip text={strings.TaskDelayBeforeStartingMessage} />
                    <br />
                    <RadioGroup
                        value={this.props.TaskActivityData.StartDelay}
                        onChange={this.props.callTaskFunction.bind(this, 'changeRadioData', 'StartDelay', this.props.index, this.props.workflowIndex)}
                    >
                        <FormControlLabel value={false} control={<Radio />} label={strings.StartWhenPriorTaskIsComplete} />
                        <FormControlLabel value={true} control={<Radio />} label={strings.StartAfterPriorTaskEndsBy} />
                    </RadioGroup>
                    <NumberField
                        label={strings.Days}
                        value={this.props.TaskActivityData.TA_start_delay}
                        min={0}
                        max={60}
                        onChange={this.props.callTaskFunction.bind(this, 'changeNumericData', 'TA_start_delay', this.props.index, this.props.workflowIndex)}
                    />
                </div>

            );

            const oneOrSeparate = /*this.props.index == 0 ? (
                <div className="inner">
                    <label>{strings.DoesEveryoneGetSameProblem}</label>
                    <Tooltip Text={strings.TaskOneOrSeparateMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-one-or-separate-tooltip`} />

                    <br />
                    <RadioGroup selectedValue={this.props.TaskActivityData.TA_one_or_separate} onChange={this.props.callTaskFunction.bind(this, 'changeRadioData', 'TA_one_or_separate', this.props.index, this.props.workflowIndex)}>
                        <label><Radio value={false} />
                            {strings.No}</label>
                        <label><Radio value />
                            {strings.Yes}</label>
                    </RadioGroup>
                </div>
            ) :*/ null;

            const seeSameActivity = (firstAssigneeConstr === 'student' || firstAssigneeConstr === 'both') ? (
                <div className="inner">
                    <label>{strings.SeeSameActivity}</label>
                    <PLTooltip text={strings.TaskSeeSameActivityMessage}  />
                    <PLCheckbox
                        checked={this.props.TaskActivityData.SeeSameActivity}
                        onChange={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'SeeSameActivity', this.props.index, this.props.workflowIndex)}
                    />
                </div>
            ) : null;

            const atDurationEnd = (
                <div className="inner">
                    <label>{strings.WhatHappensWhenTaskEnds}</label>
                    <PLTooltip text={strings.TaskAtDurationEndMessage} />
                    <br />
                    <PLSelect
                        value={this.props.TaskActivityData.TA_at_duration_end}
                        options={onTaskEndValues}
                        onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'TA_at_duration_end', this.props.index, this.props.workflowIndex)}
                    />
                </div>
            );

            // TODO AUTO BLURR?
            const whatIfLate = this.props.TaskActivityData.TA_at_duration_end === 'late'
                ? (
                    <div className="inner">
                        <label>{strings.WhatIfLate}</label>
                        <PLTooltip text={strings.TaskWhatHappensIfLateMessage} />

                        <PLSelect
                            options={onLateValues}
                            onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'TA_what_if_late', this.props.index, this.props.workflowIndex)}
                            value={this.props.TaskActivityData.TA_what_if_late}
                            autoBlur />
                    </div>
                )
                : null;

            const simpleGradeOptions = this.props.TaskActivityData.TA_simple_grade !== 'none'
                ? (
                    <div>
                        <label>{strings.ReduceByWhatPercent}</label><br />
                        <NumberField
                            value={this.props.TaskActivityData.SimpleGradePointReduction}
                            min={0}
                            max={100}
                            onChange={this.props.callTaskFunction.bind(this, 'changeTASimpleGradePoints', this.props.index, this.props.workflowIndex)}
                        />
                        <br />
                        <label>{strings.NoPointsIfLate}</label>
                        <PLCheckbox
                            onChange={this.props.callTaskFunction.bind(this, 'changeTASimpleGradeCheck', this.props.index, this.props.workflowIndex)}
                            checked={this.props.TaskActivityData.TA_simple_grade === 'off_per_day(100)'}
                        />
                    </div>
                )
                : null;
            const simpleGrade = (
                <div className="inner">
                    <label>{strings.AwardPointsForDoing}</label>
                    <PLTooltip text={strings.TaskSimpleGradeMessage} />

                    <PLCheckbox
                        onChange={this.props.callTaskFunction.bind(this, 'changeSimpleGradeCheck', this.props.index, this.props.workflowIndex)}
                        checked={this.props.TaskActivityData.TA_simple_grade !== 'none'}
                    />
                    <br />
                    {simpleGradeOptions}
                </div>
            );

            const allowAssessment = (
                <AllowAssessmentComponent
                    TaskActivityData={this.props.TaskActivityData}
                    Strings={strings}
                    index={this.props.index}
                    workflowIndex={this.props.workflowIndex}
                    callTaskFunction={this.callTaskFunction}
                />
            );

            const allowFollowOnAssessment = (
                <AllowFollowOnAssessmentComponent
                    TaskActivityData={this.props.TaskActivityData}
                    Strings={strings}
                    index={this.props.index}
                    workflowIndex={this.props.workflowIndex}
                    callTaskFunction={this.callTaskFunction}
                />
            );

            // TA_allow_reflection
            let allowReflectionOptions = null;
            let numberOfReflectorsView = null;
            let allowRevisionOption = null;
            if (this.props.TaskActivityData.TA_allow_reflection[0] !== 'none') {
                const showDispute = this.doesTaskHaveAssessmentFields() ? (
                    <div>
                        <label>{strings.CanStudentsDisputeReflection}</label>
                        <PLTooltip Text={strings.TaskCanDisputeMessage}  />
                        <PLCheckbox
                            checked={this.props.callTaskFunction('canDispute', this.props.index, this.props.workflowIndex, true)}
                            onChange={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'Reflect_Dispute', this.props.index, this.props.workflowIndex)}
                        />
                    </div>
                ) : null;

                const showConsol = this.props.callTaskFunction('getReflectNumberofParticipants', this.props.index, this.props.workflowIndex) > 1
                    ? (
                        <div>
                            <label>{strings.ShouldReflectionsBeConsolidated}</label>
                            <PLTooltip text={strings.TaskCanConsolidateMessage}/>

                            <PLCheckbox
                                onChange={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'Reflect_Consolidate', this.props.index, this.props.workflowIndex)}
                                checked={this.props.callTaskFunction('canConsolidate', this.props.index, this.props.workflowIndex, true)}
                            />
                            <br />
                            <div>
                                <label>{strings.SeeSibblingsInParent}</label>
                                <PLTooltip text={strings.TaskSeeSibblingsMessage}/>

                                <PLCheckbox
                                    onChange={this.props.callTaskFunction.bind(this, 'setSeeSibblings', this.props.index, this.props.workflowIndex, false)}
                                    checked={this.props.callTaskFunction('getSeeSibblings', this.props.index, this.props.workflowIndex, false)}
                                />
                            </div>
                        </div>
                    )
                    : null;
                const reflectConstr = this.props.callTaskFunction('getAssigneeInChild', true, this.props.index, this.props.workflowIndex);
                allowRevisionOption = this.props.TaskActivityData.TA_allow_reflection[0] === 'comment' ? (
                    <div>
                        <label>{strings.AllowRevision}</label>
                        <PLTooltip text={strings.TaskAllowRevisionMessage} />
                        <PLCheckbox
                            checked={this.props.callTaskFunction('getTaskRevisioninChild', this.props.index, this.props.workflowIndex)}
                            onChange={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'TA_allow_revisions-child', this.props.index, this.props.workflowIndex)}
                        />
                    </div>
                ) : null;

                numberOfReflectorsView = (reflectConstr === 'student' || reflectConstr === 'both')
                    ? (
                        <div>
                            <br />
                            <label>{strings.NumberOfStudents}</label>
                            <PLTooltip text={strings.TaskReflectNumberOfParticipantsMessage} />
                            <br />
                            <NumberField
                                value={this.props.callTaskFunction('getReflectNumberofParticipants', this.props.index, this.props.workflowIndex)}
                                min={1}
                                max={20}
                                onChange={this.props.callTaskFunction.bind(this, 'setReflectNumberofParticipants', this.props.index, this.props.workflowIndex)}
                            />
                            <br />
                            {showConsol}
                        </div>
                    )
                    : null;
                allowReflectionOptions = (
                    <div className="inner">
                        <PLSelect
                            options={reflectionValues}
                            onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'TA_allow_reflection', this.props.index, this.props.workflowIndex)}
                            value={this.props.TaskActivityData.TA_allow_reflection[0]}
                        />
                        <br />
                        {/*
                        <label>{strings.ShouldReflectBlock}</label><br />
                        <Tooltip Text={strings.TaskShouldReflectBlockMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-should-reflect-wait-tooltip`} />
                        <Select options={reflectWaitValues}
                            value={this.props.TaskActivityData.TA_allow_reflection[1]}
                            onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'TA_allow_reflection_wait', this.props.index, this.props.workflowIndex)}
                            clearable={false}
                            searchable={false} />
                        <br />
                        */}

                        <label>{strings.WhoCanReflect}</label>
                        <PLTooltip text={strings.TaskWhoCanReflectMessage} />
                        <PLSelect
                            options={assigneeWhoValues}
                            value={this.props.callTaskFunction('getAssigneeInChild', true, this.props.index, this.props.workflowIndex)}
                            onChange={this.props.callTaskFunction.bind(this, 'changeAssigneeInChild', true, this.props.index, this.props.workflowIndex)}
                        />
                        <br />
                        {showDispute}
                    </div>
                );
            }


            // TA_allow_revisions
            const allowRevision = /*[TASK_TYPES.EDIT, TASK_TYPES.COMMENT].includes(this.props.TaskActivityData.TA_type) ?   (
                <div className="inner">
                    <label>{strings.AllowRevision}</label>
                    <Tooltip Text={strings.TaskAllowRevisionMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-allow-revision-tooltip`} />
                    <Checkbox isClicked={this.props.TaskActivityData.TA_allow_revisions} click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'TA_allow_revisions', this.props.index, this.props.workflowIndex)} />
                </div>
            ) :*/ null;

            const allowReflection = (
                <div>
                    <div className="inner">
                        <label>{strings.AllowReflection}</label>
                        <PLCheckbox
                            onChange={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'TA_allow_reflection', this.props.index, this.props.workflowIndex)}
                            checked={this.props.TaskActivityData.TA_allow_reflection[0] !== 'none'}
                        />
                        <PLTooltip text={strings.TaskAllowReflectionMessage} />
                    </div>
                    {allowReflectionOptions}
                    <div className="inner">
                        {numberOfReflectorsView}
                        {allowRevisionOption}
                    </div>
                </div>
            );

            const versionEvaluation = this.props.TaskActivityData.TA_allow_revisions === true ? (
                <div className="inner">
                    <label>{strings.VersionEvaluation}</label>
                    <PLTooltip text={strings.TaskVersionEvaluationMessage} />
                    <PLSelect
                        value={this.props.TaskActivityData.VersionEvaluation}
                        options={versionEvaluationValues}
                        onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'VersionEvaluation', this.props.index, this.props.workflowIndex)}
                    />
                </div>
            ) : null;

            // TA_assignee_constraints
            let assigneeConstraints;
            let assigneeRelations = null;

            if (this.props.index !== 0) { // if it's the first task or an instructor task, don't show assignee contraint relation part
                if (firstAssigneeConstr !== 'instructor') {
                    const sameAsOptions = this.showAssigneeSection('same_as')
                        ? (
                            <div
                                className="checkbox-group inner"
                                style={{marginLeft: '8px'}}
                            >
                                <label className="faded-message-text">{strings.SameAs}</label>
                                {taskCreatedList.map(function (task) {
                                    return (
                                        <div>
                                            <label>{task.label}</label>
                                            <PLCheckbox
                                                checked={this.isAssigneeConstraintChecked('same_as', task.value)}
                                                onChange={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraintTasks', this.props.index, 'same_as', task.value, this.props.workflowIndex)} />
                                        </div>
                                    );
                                }, this)
                                }
                            </div>
                        )
                        : null;
                    const inSameGroupAsOptions = this.showAssigneeSection('group_with_member')
                        ? (
                            <div
                                className="checkbox-group inner"
                                style={{marginLeft: '8px',}}
                            >
                                <label className="faded-message-text">{strings.InSameGroupAs}</label>
                                {taskCreatedList.map(function (task) {
                                    return (
                                        <div>
                                            <label>{task.label}</label>
                                            <PLCheckbox
                                                checked={this.isAssigneeConstraintChecked('group_with_member', task.value)}
                                                onChange={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraintTasks', this.props.index, 'group_with_member', task.value, this.props.workflowIndex)}
                                            />
                                        </div>
                                    );
                                }, this)
                                }
                            </div>
                        )
                        : null;
                    const notInOptions = this.showAssigneeSection('not')
                        ? (
                            <div
                                className="checkbox-group inner"
                                style={{marginLeft: '8px', alignContent: 'right',}}
                            >
                                <label className="faded-message-text">{strings.NotIn}</label>
                                {taskCreatedList.map(function (task) {
                                    return (
                                        <div className="assignee-contraint-section">
                                            <label>{task.label}</label>
                                            <PLCheckbox
                                                checked={this.isAssigneeConstraintChecked('not', task.value)}
                                                onChange={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraintTasks', this.props.index, 'not', task.value, this.props.workflowIndex)}
                                            />
                                        </div>
                                    );
                                }, this)
                                }
                            </div>
                        )
                        : null;
                    const chooseFromOptions = this.showAssigneeSection('choose_from')
                        ? (
                            <div
                                className="checkbox-group inner" style={{
                                marginLeft: '8px',
                            }}
                            >
                                <label className="faded-message-text">{strings.ChooseFrom}</label>
                                {taskCreatedList.map(function (task) {
                                    return (
                                        <div>
                                            <label>{task.label}</label>
                                            <PLCheckbox
                                                checked={this.isAssigneeConstraintChecked('choose_from', task.value)}
                                                onChange={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraintTasks', this.props.index, 'choose_from', task.value, this.props.workflowIndex)}
                                            />
                                        </div>
                                    );
                                }, this)
                                }
                            </div>
                        )
                        : null;
                    assigneeRelations = (
                        <div >
                            <label>{strings.ShouldAssigneeHaveRelationship}</label>
                            <br />
                            <label>{strings.None}</label>
                            <PLTooltip text={strings.TaskConstraintNoneMessage} />

                            <PLCheckbox
                                onChange={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraints', this.props.index, 'none', this.props.workflowIndex)}
                                checked={Object.keys(this.props.TaskActivityData.TA_assignee_constraints[2]).length === 0}
                                style={{marginRight: '8px',}}
                            />
                            <label>{strings.NewToProblem}</label>
                            <PLTooltip text={strings.TaskConstraintNewToProblemMessage}/>

                            <PLCheckbox
                                onChange={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraints', this.props.index, 'not_in_workflow_instance', this.props.workflowIndex)}
                                checked={!!this.props.TaskActivityData.TA_assignee_constraints[2].not_in_workflow_instance}
                            />
                            <label>{strings.SameAs}</label>
                            <PLTooltip text={strings.TaskConstraintSameAsMessage}  />

                            <PLCheckbox
                                onChange={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraints', this.props.index, 'same_as', this.props.workflowIndex)}
                                checked={!!this.props.TaskActivityData.TA_assignee_constraints[2].same_as}
                                style={{marginRight: '8px'}}
                            />
                            <label>{strings.InSameGroupAs}</label>
                            <PLTooltip text={strings.TaskConstraintInSameGroupAsMessage} />

                            <PLCheckbox
                                onChange={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraints', this.props.index, 'group_with_member', this.props.workflowIndex)}
                                checked={!!this.props.TaskActivityData.TA_assignee_constraints[2].group_with_member}
                                style={{marginRight: '8px'}}
                            />

                            <label>{strings.NotIn}</label>
                            <PLTooltip text={strings.TaskConstraintNotInMessage} />
                            <PLCheckbox
                                onChange={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraints', this.props.index, 'not', this.props.workflowIndex)}
                                checked={!!this.props.TaskActivityData.TA_assignee_constraints[2].not}
                                style={{marginRight: '8px'}}
                            />
                            <label>{strings.ChooseFrom}</label>
                            <PLTooltip text={strings.TaskConstraintChooseFromMessage} />

                            <PLCheckbox
                                onChange={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraints', this.props.index, 'choose_from', this.props.workflowIndex)}
                                checked={!!this.props.TaskActivityData.TA_assignee_constraints[2].choose_from}
                            />
                            <br />
                            {sameAsOptions}
                            {inSameGroupAsOptions}
                            {notInOptions}
                            {chooseFromOptions}
                        </div>
                    );
                }
            }
            const showNumberofStudents = (firstAssigneeConstr === 'student' || firstAssigneeConstr === 'both') ?
                (<div>
                        <label>{strings.HowManyParticipants}</label>
                        <PLTooltip text={strings.TaskNumOfParticipantsMessage}/>
                        <NumberField
                            value={this.props.TaskActivityData.TA_number_participant}
                            min={1}
                            max={20}
                            onChange={this.props.callTaskFunction.bind(this, 'changeNumericData', 'TA_number_participant', this.props.index, this.props.workflowIndex)}
                        />
                    </div>
                ) : null;
            assigneeConstraints = (
                <div>
                    <b style={{textAlign: 'center'}}><label>{strings.AssigneeConstraints}</label>
                        <PLTooltip text={strings.TaskAssigneeConstraintMessage} />
                    </b>
                    <br />
                    <label>{strings.WhoCanDoTask}</label>
                    <PLTooltip text={strings.TaskWhoCanDoMessage}/>
                    <br />
                    <PLSelect
                        options={assigneeWhoValues}
                        value={this.props.TaskActivityData.TA_assignee_constraints[0]}
                        onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'TA_assignee_constraints', this.props.index, this.props.workflowIndex)}
                    />
                    {showNumberofStudents}
                    {/*
                            //Remove Group options for now
 <label>{strings.WillThisBeGroupTask}</label>
                    <Tooltip Text={strings.TaskGroupTaskMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-task-group-task-tooltip`} />

                    <Checkbox click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'TA_assignee_constraints', this.props.index, this.props.workflowIndex)} isClicked={this.props.TaskActivityData.TA_assignee_constraints[1] == 'group'} />


                    */}
                    {assigneeRelations}
                </div>
            );

            const seeSibblings = (this.props.TaskActivityData.TA_number_participant > 1) ? (
                <div className="inner">
                    <label>{strings.SeeSibblingsLabel}
                        <PLTooltip text={strings.TaskSeeSibblingsMessage} />
                        <PLCheckbox
                            checked={this.props.TaskActivityData.SeeSibblings}
                            onChange={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'SeeSibblings', this.props.index, this.props.workflowIndex)}
                        />
                    </label>
                </div>
            ) : null;


            // TA_leads_to_new_problem
            const leadsToNewProblem = (
                <div className="inner">
                    <label>{strings.DoesThisLeadToNewProblem}?</label>
                    <PLTooltip text={strings.TaskLeadsToNewProblemMessage}/>
                    <PLCheckbox
                        onChange={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'TA_leads_to_new_problem', this.props.index, this.props.workflowIndex)}
                        checked={this.props.TaskActivityData.TA_leads_to_new_problem}
                    />
                </div>
            );

            // TA_leads_to_new_solution
            const leadsToNewSolution = (
                <div className="inner">
                    <label>{strings.DoesThisLeadToNewSolution}?</label>
                    <PLTooltip text={strings.TaskLeadToNewSolutionMessage} />

                    <PLCheckbox
                        onChange={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'TA_leads_to_new_solution', this.props.index, this.props.workflowIndex)}
                        checked={this.props.TaskActivityData.TA_leads_to_new_solution}
                    />
                </div>
            );

            const mustCompleteFirst = (
                <div className="inner">
                    <label>{strings.MustCompleteFirstLabel}</label>
                    <PLTooltip text={strings.MustCompleteFirstMessage}  />
                    <PLCheckbox
                        onChange={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'TA_MustCompleteThisFirst', this.props.index, this.props.workflowIndex)}
                        checked={this.props.TaskActivityData.TA_MustCompleteThisFirst}
                    />
                </div>
            );

            let followOnAssessmentTaskView = <div/>;

            if(taskCreatedList.length > 0){
                followOnAssessmentTaskView =  <div className="section-divider">
                    {/* <div className="subheading">{strings.AssessmentFollowOnHeader}</div> */}
                    {allowFollowOnAssessment}
                </div>;
            }

            advancedOptionsView = (
                <div key={`Advanced Task-level Parameters for ${this.props.index} in ${this.props.workflowIndex}`} className="section card-2">
                    <h2 className="title" onClick={this.toggleAdvanced}>{strings.AdvancedTaskParamHeader}
                        <span className={'fa fa-angle-up'} style={{float: 'right'}}/>
                    </h2>
                    <div className="section-content">
                        <div className="advanced">
                            <div className="section-divider">
                                <div className="subheading">{strings.TaskDurationHeader}</div>
                                {dueType}
                                {startDelay}
                            </div>
                            <div className="section-divider">
                                <div className="subheading">{strings.TaskDueHeader}</div>
                                {atDurationEnd}
                                {whatIfLate}
                                {mustCompleteFirst}
                            </div>
                            <div className="section-divider">
                                <div className="subheading">{strings.ReflectionHeader}</div>
                                {allowReflection}
                                {allowRevision}
                            </div>
                            <div className="section-divider">
                                <div className="subheading">{strings.AssessmentHeader}</div>
                                {simpleGrade}
                                {allowAssessment}
                            </div>
                            {followOnAssessmentTaskView}
                            <div className="section-divider">
                                <div className="subheading">{strings.FollowOnHeader}</div>
                                {leadsToNewProblem}
                                {leadsToNewSolution}
                            </div>
                            <div className="section-divider">
                                <div className="subheading">{strings.AssigneeConstraintHeader}</div>
                                {oneOrSeparate}
                                {seeSameActivity}
                                {versionEvaluation}
                                {seeSibblings}
                                {assigneeConstraints}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        let  userInputFields = (
            <div key={`User Input Fields for ${this.props.index} in ${this.props.workflowIndex}`} className="section card-2">
                <h2 className="title" onClick={this.toggleUserFields}>{strings.UserFieldHeader}
                    <span className="fa fa-angle-down" style={{float: 'right'}}/>
                </h2>
            </div>
        );

        let fieldDistWeights = this.mapFieldDistToOptions();
        let fieldDistView = null;
        if(fieldDistWeights.length > 1){
            fieldDistView =
                <div>
                    <h3 className="subheading">{strings.FieldWeights}</h3>
                    <ul>
                        {
                            fieldDistWeights.map((fieldObject) => {
                                return <li className="thin-number-field" key={'workflowWeight' + fieldObject.id}>
                                    <label>{fieldObject.name}</label>
                                    <NumberField
                                        key = {'probDet-NumF '+fieldObject.id} allowDecimals={false}
                                        min={0} max={100}
                                        onChange={this.props.callTaskFunction.bind(this,'changeTaskFieldDist', fieldObject.id, this.props.index, this.props.workflowIndex)}
                                        value={fieldObject.weight} />
                                </li>;
                            })
                        }
                    </ul>
                </div>;
        }

        if(this.state.ShowUserFields){
            userInputFields = (
                <div key={`User Input Fields for ${this.props.index} in ${this.props.workflowIndex}`} className="section card-2">
                    <h2 className="title" onClick={this.toggleUserFields}>{strings.UserFieldHeader}
                        <PLTooltip text={strings.TaskInputFieldsHeaderMessage} />
                        <span className="fa fa-angle-up" style={{float: 'right'}}/>
                    </h2>
                    <div className="section-content">
                        {fieldDistView}
                        {inputFields}
                        <div className="inner block" >
                            {fieldButton}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div key={`Main View of Task ${this.props.index} in ${this.props.workflowIndex}`}>
                {taskLevelParameters}
                <br />
                {userInputFields}
                <br/>
                {advancedOptionsView}
            </div>

        );
    }
}

export default TaskDetailsComponent;
