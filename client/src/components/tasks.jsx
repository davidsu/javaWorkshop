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
    constructor(){
        super()
        this.paginationClicked = this.paginationClicked.bind(this)
        this.filterChanged = this.filterChanged.bind(this)
    }

    filterChanged(evt, filters){
        if(evt.key === 'Enter'){
            ajax.getTasks(() => {
                rootComponent.forceUpdate();
                window.store.tasksFilter = filters
            }, this.props.metaData.Page, filters);
        }
    }

    addTask() {
        console.log('addTaskClicked: ');
        ajax.getTaskMetadata(()=>{
            window.store.activeMenu = 'task:'
            rootComponent.forceUpdate();
        })
    }

    paginationClicked(e){
        const page = e.target.textContent;
        const self = this
        ajax.getTasks(() => rootComponent.forceUpdate(), page);
    }

    tableRowClicked(task){
        window.store.task = task;
        ajax.getTask(task.id, () => {
            window.store.activeMenu = 'task:'
            rootComponent.forceUpdate();
        })
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
                    onAddItem={this.addTask}
                    addItemDisplayName='Add Task'
                    columns={columns}
                    panelTitle='tasks'
                    onTableRowClicked={this.tableRowClicked}
                    items={this.props.tasks}
                    clientSideFilter={false}
                    filterChanged={this.filterChanged}>
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