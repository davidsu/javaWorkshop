import React from 'react'
import _ from 'lodash'
import FilterableTable from './filterableTable.jsx'
import ajax from '../ajax.js'

//see example here: http://bootsnipp.com/snippets/featured/panel-table-with-filters-per-column
const columns = [
    'id',
    'taskType',
    'open_date',
    'status',
    'exec_date'
];
class tasks extends React.Component {

    addTask() {
        console.log('addTaskClicked: ');
        ajax.getTaskMetadata(()=>{
            window.store.activeMenu = 'task:'
            rootComponent.forceUpdate();
        })
    }

    tableRowClicked(task){
        window.store.task = task;
        ajax.getTask(task.id, () => {
            window.store.activeMenu = 'task:'
            rootComponent.forceUpdate();
        })
        console.log('tableRowClicked: ', task);
    }

    render() {
        return (
            <div className="container">
                <FilterableTable
                    onAddItem={this.addTask}
                    addItemDisplayName='Add Task'
                    columns={columns}
                    panelTitle='tasks'
                    onTableRowClicked={this.tableRowClicked}
                    items={this.props.tasks}>
                </FilterableTable>
            </div>
        )
    }
}
module.exports = tasks