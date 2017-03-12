import React from 'react'
import _ from 'lodash'
//see example here: http://bootsnipp.com/snippets/featured/panel-table-with-filters-per-column
const columns = [
    'ID',
    'Type',
    'Open Date',
    'Status',
    'Exec. Date'
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

    renderFilters() {
        const disabled = {disabled: !this.state.isFiltering}
        return (
            <thead>
            <tr className="filters">
                {_.map(columns, val => <th  key={val}><input type="text" className="form-control" placeholder={val} {...disabled}/></th> )}
            </tr>
            </thead>
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
                            {this.renderFilters()}
                            <tbody>
                            <tr>
                                <td>1</td>
                                <td>Install</td>
                                <td>10.1.2017</td>
                                <td>new</td>
                                <td>20.1.2017</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Config</td>
                                <td>10.1.2017</td>
                                <td>done</td>
                                <td>20.1.2017</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Config</td>
                                <td>10.1.2017</td>
                                <td>expired</td>
                                <td>20.1.2017</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}
module.exports = request