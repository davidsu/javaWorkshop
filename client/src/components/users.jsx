import React from 'react'
import _ from 'lodash'
//see example here: http://bootsnipp.com/snippets/featured/panel-table-with-filters-per-column
const columns = [
    'id',
    'full_name',
    'type',
    'email',
    'password'
];
class request extends React.Component {
    constructor() {
        super()
        this.state = {
            isFiltering: false,
            filters: _.reduce(columns, (acc, val)=> {
                acc[val] = '';
                return acc;
            }, {}),
            sort: ''
        }
        this.filterButtonClicked = this.filterButtonClicked.bind(this)
        this.filter = this.filter.bind(this)
        this.tableHeaderClicked = this.tableHeaderClicked.bind(this)
    }

    filter(evt, val) {
        const filters = this.state.filters;
        filters[val] = evt.nativeEvent.srcElement.value;
        this.setState({filters})
    }

    alphabetical(a, b) {
        var A = a.toLowerCase();
        var B = b.toLowerCase();
        if (A < B){
            return -1;
        }else if (A > B){
            return  1;
        }else{
            return 0;
        }
    }

    tableHeaderClicked(evt, key) {
        if (!this.state.isFiltering) {
            this.setState({sort: key})
        }
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
                {_(columns)
                    .map((val, key) => (
                        <th key={val}
                            onClick={evt => this.tableHeaderClicked(evt, val)}>
                            <input {...disabled}
                                type="text"
                                className="form-control"
                                placeholder={val}
                                onKeyUp={evt => this.filter(evt, val)}
                                onBlur={evt=>{window.blur = evt; console.log(evt)}}/>
                        </th>))
                    .value()
                }
            </tr>
            </thead>
        )
    }

    renderTableBody() {
        const self = this;
        return (
            <tbody>
            {_(self.props.users)
                .filter(user => {
                    return _.every(user, (value = '', key = '0') => {
                        return value.indexOf(self.state.filters[key]) > -1})
                })
                .thru(arr => {
                    const sortKey = self.state.sort
                    if(!sortKey){
                        return arr
                    }
                    return arr.sort((a,b) => self.alphabetical(a[sortKey], b[sortKey]))
                })
                .map(user => (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.full_name}</td>
                    <td>{user.type}</td>
                    <td>{user.email}</td>
                    <td>{user.password}</td>
                </tr>
            )).value()}
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
                                <button className="btn btn-default btn-xs btn-filter"
                                        onClick={this.filterButtonClicked}><span
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