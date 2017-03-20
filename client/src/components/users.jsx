import React from 'react'
import _ from 'lodash'
import FilterableTable from './filterableTable.jsx'
//see example here: http://bootsnipp.com/snippets/featured/panel-table-with-filters-per-column
const columns = [
    'id',
    'full_name',
    'type',
    'email',
    'password'
];
class users extends React.Component {
    constructor(){
        super()
        this.tableRowClicked = this.tableRowClicked.bind(this)
        this.addUser = this.addUser.bind(this)
    }
    tableRowClicked(user) {
        this.props.setCurrentUser(user)
    }

    addUser() {
        const user = _.reduce(columns, (acc, val) => {
            acc[val] = '';
            return acc;
        }, {})
        this.props.setCurrentUser(user)
    }

    render() {
        return (
            <div className="container">
                <FilterableTable
                    onAddItem={this.addUser}
                    addItemDisplayName='Add User'
                    columns={columns}
                    panelTitle='Users'
                    onTableRowClicked={this.tableRowClicked}
                    items={this.props.users}>
                </FilterableTable>
            </div>
        )
    }
}
module.exports = users