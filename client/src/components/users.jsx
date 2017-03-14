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
class request extends React.Component {
    tableRowClicked(user) {
        window.activeMenu = 'user:'
        window.store.user = user
        rootComponent.forceUpdate()
    }

    addUser() {
        window.store.user = _.reduce(columns, (acc, val) => {
            acc[val] = '';
            return acc;
        }, {})
        window.activeMenu = 'user:'
        rootComponent.forceUpdate()
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
module.exports = request