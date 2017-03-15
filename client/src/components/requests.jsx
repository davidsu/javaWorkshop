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
class requests extends React.Component {

    addTask() {
        console.log('add task clicked' )
    }

    tableRowClicked(task){
        window.store.task = task;
        ajax.getTask(task.id, () => {
            window.activeMenu = 'task:'
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
                    panelTitle='Requests'
                    onTableRowClicked={this.tableRowClicked}
                    items={this.props.tasks}>
                </FilterableTable>
            </div>
        )
    }
}
module.exports = requests