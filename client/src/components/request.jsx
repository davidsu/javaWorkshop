import React from 'react'
import _ from 'lodash'
import FilterableTable from './filterableTable.jsx'

//see example here: http://bootsnipp.com/snippets/featured/panel-table-with-filters-per-column
const columns = [
    'id',
    'taskType',
    'open_date',
    'status',
    'exec_date'
];
class request extends React.Component {

    addTask() {
        console.log('add task clicked' )
    }

    tableRowClicked(task){
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
module.exports = request