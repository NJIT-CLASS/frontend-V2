import React from 'react';

const HeaderComponent = ({Strings}) =>  (
        <div className="section">
            <div className="section-content" >
                {Strings.MainHeader}
                <ol>
                    <li>{Strings.AssignmentHeader}</li>
                    <li>{Strings.WorkflowHeader}</li>
                    <li>{Strings.TaskHeader}</li>
                </ol>
            </div>
        </div>
);

export default HeaderComponent;