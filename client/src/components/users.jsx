import React from 'react'
import _ from 'lodash'
//see example here: http://bootsnipp.com/snippets/featured/panel-table-with-filters-per-column
const columns = [
    'ID',
    'full_name',
    'type',
    'email',
    'password'
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
        //here filtering should be done client side, we expect to get the whole table from the server
        const disabled = {disabled: !this.state.isFiltering}
        return (
            <thead>
                <tr className="filters">
                    {_.map(columns, val => <th  key={val}><input type="text" className="form-control" placeholder={val} {...disabled}/></th> )}
                </tr>
            </thead>
        )
    }

    renderTableBody() {
        return (
            <tbody>
                {_.map(this.props.users, user => (
                    <tr>
                        <td>{user.id}</td>
                        <td>{user.full_name}</td>
                        <td>{user.type}</td>
                        <td>{user.email}</td>
                        <td>{user.password}</td>
                    </tr>
                ))}
            </tbody>
        )
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="panel panel-primary filterable">
                        <div className="panel-heading">
                            <h3 className="panel-title">Users</h3>
                            <div className="pull-right">
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