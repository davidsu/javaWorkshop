import React from 'react'
import _ from 'lodash'
//see example here: http://bootsnipp.com/snippets/featured/panel-table-with-filters-per-column
const columns = [
    'id',
    'taskType',
    'open_date',
    'status',
    'exec_date'
];
class request extends React.Component {
    constructor() {
        super()
        this.state = {isFiltering: false}
        this.filterButtonClicked = this.filterButtonClicked.bind(this)
    }
    filterButtonClicked() {
        this.setState({isFiltering: !this.state.isFiltering})
    }

    renderTableHeader() {
        const disabled = {disabled: !this.state.isFiltering}
        return (
            <thead>
            <tr className="filters">
                {_.map(columns, val => <th  key={val}><input type="text" className="form-control" placeholder={val} {...disabled}/></th> )}
            </tr>
            </thead>
        )
    }

    renderTableBody(){

        return (
            <tbody>
            {_.map(window.store.tasks, val => {
                return (
                    <tr>
                        {_.map(columns, colName => <td>{val[colName]}</td>)}
                    </tr>
                )
            })}
            </tbody>
        )
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="panel panel-primary filterable">
                        <div className="panel-heading">
                            <h3 className="panel-title">Requests List</h3>
                            <div className="pull-right table-filter-btn">
                                <button className="btn btn-default btn-xs btn-filter" onClick={this.filterButtonClicked}><span
                                    className="glyphicon glyphicon-filter"></span> Filter
                                </button>
                            </div>
                        </div>
                        <table className="table">
                            {this.renderTableHeader()}
                            {this.renderTableBody()}

                        </table>
                    </div>
                </div>
            </div>
        )
    }
}
module.exports = request