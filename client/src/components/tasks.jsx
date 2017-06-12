import React from 'react'
import _ from 'lodash'
import FilterableTable from './filterableTable.jsx'

//see Server here: http://bootsnipp.com/snippets/featured/panel-table-with-filters-per-column
const columns = [
    'id',
    'taskType',
    'open_date',
    'status',
    'exec_date'
];
class tasks extends React.Component {
    constructor(){
        super()
        this.paginationClicked = this.paginationClicked.bind(this)
        this.filterChanged = this.filterChanged.bind(this)
        this.tableRowClicked = this.tableRowClicked.bind(this)
    }

    filterChanged(evt, filters){
        this.props.setTasksFilter(filters)
        if(evt.key === 'Enter'){
            this.props.refreshTasks(undefined, 1)
        }
    }

    paginationClicked(e){
        const page = e.target.textContent;
        this.props.refreshTasks(_.noop, page)
    }

    tableRowClicked(task){
        this.props.setCurrentTask(task);
    }

    getPagination(){
        if(!this.props.metaData){
            return null;
        }
        const retVal = []
        for(let i = 1; i <= this.props.metaData.TotalPages; i++){
            const className = "page-item" + ( i == this.props.metaData.Page  ?" active" : "")
            retVal.push(<li key={'pag'+i} className={className}><span className="page-link" style={{cursor: 'pointer'}} onClick={this.paginationClicked}>{i}</span></li>)
        }
        return retVal;
    }

    render() {
        return (
            <div className="container">
                <h1 style={{textAlign: 'center', fontFamily:'arialBlack', fontSize:'5em', margin:'-10px 0 -20px 0'}}>Task List</h1>
                <FilterableTable
                    onAddItem={this.props.onAddingTask}
                    addItemDisplayName='Add Task'
                    columns={columns}
                    panelTitle='tasks'
                    onTableRowClicked={this.tableRowClicked}
                    items={this.props.tasks}
                    clientSideFilter={false}
                    filterChanged={this.filterChanged}
                    filters={this.props.filter}>
                </FilterableTable>
                <nav>
                    <ul className="pagination">
                        {this.getPagination()}
                    </ul>
                </nav>
            </div>
        )
    }
}
module.exports = tasks
