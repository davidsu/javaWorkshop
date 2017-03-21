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
//todo click on paginagion retain filter
//todo return from edit task retain filter
class tasks extends React.Component {
    constructor(){
        super()
        this.paginationClicked = this.paginationClicked.bind(this)
        this.filterChanged = this.filterChanged.bind(this)
        this.tableRowClicked = this.tableRowClicked.bind(this)
    }

    filterChanged(evt, filters){
        const setTasksFilter = this.props.setTasksFilter
        if(evt.key === 'Enter'){
            ajax.getTasks(() => {
                rootComponent.forceUpdate();
                setTasksFilter(filters)
            }, this.props.metaData.Page, filters);
        }
    }

    paginationClicked(e){
        const page = e.target.textContent;
        const self = this
        ajax.getTasks(() => rootComponent.forceUpdate(), page, this.props.filter);
    }

    tableRowClicked(task){
        this.props.setCurrentTask(task);
        console.log('tableRowClicked: ', task);
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
                        <li className="page-item">
                            <a className="page-link" href="#">
                                <span>&laquo;</span>
                                <span className="sr-only">Previous</span>
                            </a>
                        </li>
                        {this.getPagination()}
                        <li className="page-item">
                            <a className="page-link" href="#">
                                <span>&raquo;</span>
                                <span className="sr-only">Next</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
}
module.exports = tasks