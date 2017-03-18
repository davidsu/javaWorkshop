import React from 'react'
import _ from 'lodash'

class filterableTable extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            isFiltering: false,
            filters: _.reduce(this.props.columns, (acc, val)=> {
                acc[val] = '';
                return acc;
            }, {}),
            sort: '',
            ascending: true
        }
        this.filterButtonClicked = this.filterButtonClicked.bind(this)
        this.filter = this.filter.bind(this)
        this.tableHeaderClicked = this.tableHeaderClicked.bind(this)
        this.renderTableHeader = this.renderTableHeader.bind(this)
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
            let ascending = (this.state.sort === key)? !this.state.ascending : true;
            this.setState({sort: key, ascending: ascending})
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
                {_(this.props.columns)
                    .map((val, key) => (
                        <th key={val}
                            onClick={evt => this.tableHeaderClicked(evt, val)}>
                            <input {...disabled}
                                type="text"
                                className="form-control"
                                placeholder={val}
                                onKeyUp={evt => this.filter(evt, val)}/>
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
            {_(self.props.items)
                .filter(item => {
                    return _.every(item, (value = '', key = '0') => {
                        return !self.state.filters[key] || value.indexOf(self.state.filters[key]) > -1})
                })
                .thru(arr => {
                    const sortKey = self.state.sort
                    if(!sortKey){
                        return arr
                    }
                    return arr.sort((a,b) => {
                        if(sortKey.toLowerCase() === 'id'){
                            if(this.state.ascending){
                                return Number(a[sortKey]) - Number(b[sortKey])
                            }
                            return Number(b[sortKey]) - Number(a[sortKey])

                        }
                        if(this.state.ascending){
                            return self.alphabetical(a[sortKey], b[sortKey])
                        }
                        return self.alphabetical(b[sortKey], a[sortKey])

                    })
                })
                .map(item => (
                    <tr key={item.id} onClick={() => self.props.onTableRowClicked(item)}>
                        {
                            _.map(self.props.columns, (colName, idx) => {
                                return <td key={idx+colName+item[colName]}>{item[colName]}</td>
                            })
                        }
                    </tr>
                )).value()}
            </tbody>
        )
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <button className="btn btn-default text-right" style={{float: 'right'}} onClick={this.props.onAddItem}>{this.props.addItemDisplayName}</button>
                    <div className="panel panel-primary filterable" style={{marginTop: '50px'}}>
                        <div className="panel-heading">
                            <h3 className="panel-title">{this.props.panelTitle}</h3>

                            <div className="pull-right table-filter-btn">
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

filterableTable.propTypes = {
    addItemDisplayName: React.PropTypes.string,
    columns: React.PropTypes.array,
    items: React.PropTypes.array,
    onAddItem: React.PropTypes.func,
    onTableRowClicked: React.PropTypes.func,
    panelTitle: React.PropTypes.string
}

module.exports = filterableTable