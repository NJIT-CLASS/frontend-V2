import React, {Component} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import TreeView from "@material-ui/lab/TreeView"
import TreeItem from "@material-ui/lab/TreeItem";
import Icon from "@material-ui/core/Icon";


let TreeModel = require('tree-model'); /// references: http://jnuno.com/tree-model-js/  https://github.com/joaonuno/tree-model-js
let FlatToNested = require('flat-to-nested');

const faded = {
    color: "grey"
};

const normal = {
    color: "blue"
};

class TreeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            workflow: null,
            WorkflowStructure: null,
            expandedNodes: []
        };
        this.tree = new TreeModel(); //this is the tree making object. It is not a tree structure but has the tree methods

    }

    unflattenTreeStructure(flatTreeArray){
        if( typeof flatTreeArray == 'string') flatTreeArray = JSON.parse(flatTreeArray);
        let flatToNested = new FlatToNested();
        let nestedTreeObj = flatToNested.convert(flatTreeArray);
        return this.tree.parse(nestedTreeObj);
    }

    makeTreeView(node){

        console.log(node);
        if(node == null || node.model.id === -1 || node.Tasks === undefined) return <span/>;

        let nodeLink = null;
        let status = JSON.parse(node.Tasks[0].Status)[0];
        switch(status){
            case "complete":
                nodeLink = <Link to={'/task/'+node.Tasks[0].TaskInstanceID}><span style={normal}>{node.Tasks[0].TaskActivity.DisplayName}</span></Link>;
                break;
            case "bypassed":
                nodeLink = <span style={faded}>{node.Tasks[0].TaskActivity.DisplayName} (<span style={{fontWeight: "bold"}}>bypassed</span>)</span>;
                break;
            case "cancelled":
                nodeLink = <span style={faded}>{node.Tasks[0].TaskActivity.DisplayName} (<span style={{fontWeight: "bold"}}>cancelled</span>)</span>;
                break;
            case "automatic":
                nodeLink = <span style={faded}>{node.Tasks[0].TaskActivity.DisplayName} (<span style={{fontWeight: "bold"}}>automatic</span>)</span>;
                break;

            default:
                // if status is pending or not-started-yet
                nodeLink = <span style={faded}>{node.Tasks[0].TaskActivity.DisplayName}</span>;
        }


        let nodeChildrenTrees = [];
        if(node.children.length !== 0){
            nodeChildrenTrees = node.children.map( x => this.makeTreeView(x));
        }
        return (
            <TreeItem label={nodeLink} nodeId={node.id.toString()} key={node.id}>
                {nodeChildrenTrees}
            </TreeItem>
        );
    }

    componentDidMount() {
        axios.get(`/EveryonesWork/alternate/${this.props.AssignmentID}`).then((response) => {
            const body = response.data;
            let treeArray = null;
            let tasksForStructure = null;
            for(let i=0; i<Object.keys(body.Workflows).length; i++) {
                const firstKey = Object.keys(body.Workflows)[i];
                let workflowInstanceSelected = body.Workflows[firstKey].WorkflowInstances.filter(x => x.WorkflowInstanceID === this.props.WorkflowID)[0];
                console.log("workflowInstanceSelected", workflowInstanceSelected);
                if(workflowInstanceSelected){
                    treeArray = body.Workflows[firstKey].Structure;
                    tasksForStructure = workflowInstanceSelected.Tasks;
                    break;
                }
            }

            let taskInvertedByActivityID = {};
            tasksForStructure.forEach(taskInstance => {
                let currentTaskActivityID = taskInstance.TaskActivity.TaskActivityID;
                if(taskInvertedByActivityID[currentTaskActivityID] === undefined){
                    taskInvertedByActivityID[currentTaskActivityID]  = [ taskInstance];
                } else {
                    taskInvertedByActivityID[currentTaskActivityID].push(taskInstance);
                }
            });

            console.log("treeArray", treeArray);
            console.log("taskInvertedByActivityID", taskInvertedByActivityID)

            const treeStructure = this.unflattenTreeStructure(treeArray);
            console.log("treeStructure", treeStructure)
            let nNode = 0;
            treeStructure.walk({strategy: 'pre'}, node => {
                const tasks = taskInvertedByActivityID[node.model.id]
                node.Tasks = tasks;
                if(tasks.length > 1){
                    // if we have more than one tasks, making tasks 2, 3 ...  children nodes of the parent
                    // for(let i=1; i < tasks.length; i++){
                    //     const newNode = this.tree.parse({children: []})
                    //     newNode.id = nNode;
                    //     newNode.Tasks = [tasks[i]];
                    //     nNode++;
                    //     node.parent.addChild(newNode)
                    // }
                }
                // node id is for the key property
                node.id = nNode;
                nNode += 1;
            }, this);

            let expanded = [];
            for(let i=0; i < nNode; i++){
                expanded.push(i.toString())
            }

            this.setState({
                WorkflowStructure: treeStructure,
                expandedNodes: expanded
            });
        });
    }

    render() {
        return (
            <div className="card">
                {this.state.expandedNodes.length !==0 ?
                    (<TreeView

                        defaultCollapseIcon={<Icon className={"fas fa-chevron-down"} style={{fontSize: 10}} />}
                        defaultExpanded={this.state.expandedNodes}
                        defaultExpandIcon={<Icon className={"fas fa-chevron-right"} style={{fontSize: 10}}/>}
                    >
                        {this.makeTreeView(this.state.WorkflowStructure)}
                    </TreeView>): null
                }

            </div>
        )
    }
}

export default TreeComponent;