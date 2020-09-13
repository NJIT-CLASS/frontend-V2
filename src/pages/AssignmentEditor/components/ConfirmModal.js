import React from 'react';
import PLModal from "../../../shared/PLModal/PLModal";
import { confirmable, createConfirmation } from 'react-confirm';
import PropTypes from 'prop-types';


// TODO Remove react-confirm dependency
const ConfirmModal = ({okLabel, cancelLabel, title, list, show, proceed, dismiss, cancel, confirmation, options}) => {

    return (
        <PLModal close={dismiss} title={title}>
            <div id="modal-text">
                <div dangerouslySetInnerHTML={{__html: confirmation}}/>
            </div>
            <div id="modal-footer">
                <button className="button" id="cancel-button" onClick={proceed}>{okLabel}</button>
                <button className="button" id="confirm-button" onClick={cancel}>{cancelLabel}</button>
            </div>
        </PLModal>
    );

};

ConfirmModal.propTypes = {
    okLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    title: PropTypes.string,
    list: PropTypes.array,
    show: PropTypes.bool,            // from confirmable. indicates if the dialog is shown or not.
    proceed: PropTypes.func,         // from confirmable. call to close the dialog with promise resolved.
    cancel: PropTypes.func,          // from confirmable. call to close the dialog with promise rejected.
    dismiss: PropTypes.func,         // from confirmable. call to only close the dialog.
    confirmation: PropTypes.string,  // arguments of your confirm function
    options: PropTypes.object        // arguments of your confirm function
};

export default createConfirmation(confirmable(ConfirmModal));

