import React from 'react';
import PLTooltip from "../../../shared/PLTooltip/PLTooltip";

// This component renders the task status legend on the Assignment Status page.
const LegendSection = ({Strings}) => {
    const colors = {
        viewed: 'viewed',
        complete: 'complete',
        late: 'late',
        cancelled: 'cancelled',
        not_yet_started: 'not-yet-started',
        started: 'started',
        bypassed:'bypassed',
        automatic: 'automatic',
    };

    const letters = {
        viewed: '(O)',
        complete: '(C)',
        late: '(L)',
        cancelled: '(X)',
        not_yet_started: '(NP)',
        started: '(P)',
        bypassed: '(B)',
        automatic: '(A)',
    };

    const statusToString = {
        viewed: 'Viewed',
        complete: 'Complete',
        late: 'Late',
        cancelled: 'Cancelled',
        not_yet_started: 'NotYetStarted',
        started: 'Started',
        bypassed: 'Bypassed',
        automatic: 'Automatic',
    };

    let statusArray =  [
        'viewed',
        'complete',
        'late',
        'cancelled',
        'not_yet_started',
        'started',
        'bypassed',
        'automatic'
    ].map((status) => {
        const statusString = Strings[statusToString[status]];
        const tooltipString = Strings[statusToString[status] + 'Tooltip'];
        return (
            <div key={status} className={`legend-block ${colors[status]}`}>
                <span>{statusString} {letters[status]}</span>
                <PLTooltip
                    text={tooltipString}
                />
            </div>
        );
    });

    return (
        <div className="legend-table">
            {statusArray}
        </div>
    );


};

export default LegendSection;
