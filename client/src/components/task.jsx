import React from 'react'

function isEmptyTask(){return false;}
class task extends React.Component {
    constructor(props) {
        super(props)
        console.log(props)
        this.state = {
            id: props.task.id,
            taskTypeId: props.task.taskTypeId,
            productId: props.task.productId,
            envId: props.task.envId,
            requesterId: props.task.requesterId,
            priority: props.task.priority,
            open_date: props.task.open_date,
            exec_date: props.task.exec_date,
            status: props.task.status,
            qaGO: props.task.qaGO,
            rollBack: props.task.rollBack,
            urgent: props.task.urgent,
            additionalInfoId: props.task.additionalInfoId,
            assigneeId: props.task.assigneeId,
            resolved_by_Id: props.task.resolved_by_Id
        }
        const self = this;
        this.typeChange = e => self.setState({taskTypeId: e.target.value})
        this.productChange = e => self.setState({productId: e.target.value})
        this.environmentChange = e => self.setState({envId: e.target.value})
        this.requesterChange = e => self.setState({requesterId: e.target.value})
        this.priorityChange = e => self.setState({priority: e.target.value})
        this.statusChange = e => self.setState({status: e.target.value})
        this.executionDateChange = e => self.setState({exec_date: e.target.value})
    }

    close() {
        window.activeMenu = 'tasks'
        window.rootComponent.forceUpdate()
    }
    submitClicked(){}

    makeDropDown({label, value, onChange, optionsArr, optionKey}) {
        return(
            <div>
                <label className="col-sm-4 control-label">{label}</label>
                <div className="col-sm-8">
                    <select className="form-control" value={value} onChange={onChange}>
                        {_.map(optionsArr, product => {
                            return (
                                <option
                                    key={product.id+label}
                                    value={product.id}>
                                    {product[optionKey]}
                                </option>
                            )
                        })}
                    </select>
                </div>
                <div className="col-sm-12" style={{height: '10px'}}></div>
            </div>
        )
    }

    render() {
        return (
            <div className="container">
                <div className="row" style={{marginTop:40 + 'px'}}>
                    <div className="col-md-12 ">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h2 className="panel-title" style={{textDecoration: 'underline', color:'#555'}}>TASK</h2>

                                <div className="pull-right">
                                    <button type="button" className="close table-filter-btn" onClick={this.close}>x
                                    </button>
                                </div>
                            </div>
                            <div className="panel-body">
                                <form role="form">
                                    <fieldset>
                                        <div className='col-sm-6'>
                                            {
                                                this.makeDropDown({
                                                    label: 'Type',
                                                    value: this.state.taskTypeId,
                                                    onChange: this.typeChange,
                                                    optionsArr: this.props.taskTypes,
                                                    optionKey: 'taskType'
                                                })
                                            }
                                            {
                                                this.makeDropDown({
                                                    label: 'Product',
                                                    value: this.state.productId,
                                                    onChange: this.productChange,
                                                    optionsArr: this.props.products,
                                                    optionKey: 'productName'
                                                })
                                            }
                                            {
                                                this.makeDropDown({
                                                    label: 'Environment',
                                                    value: this.state.envId,
                                                    onChange: this.environmentChange,
                                                    optionsArr: this.props.environments,
                                                    optionKey: 'envName'
                                                })
                                            }
                                            {
                                                this.makeDropDown({
                                                    label: 'Requester',
                                                    value: this.state.requesterId,
                                                    onChange: this.requesterChange,
                                                    optionsArr: this.props.users,
                                                    optionKey: 'full_name'
                                                })
                                            }
                                        </div>
                                        <div className='col-sm-6'>
                                            <label className="col-sm-4 control-label">Open Date</label>
                                            <div className="col-sm-8">
                                                <input className="form-control" disabled value={this.state.open_date}/>
                                            </div>
                                            <div className="col-sm-12" style={{height: '10px'}}></div>

                                            <label className="col-sm-4 control-label">Execution Date</label>
                                            <div className="col-sm-8">
                                                <input className="form-control" value={this.state.exec_date} onChange={this.executionDateChange}></input>
                                            </div>
                                            <div className="col-sm-12" style={{height: '10px'}}></div>

                                            <label className="col-sm-4 control-label">Priority</label>
                                            <div className="col-sm-8">
                                                <input className="form-control" value={this.state.priority} onChange={this.priorityChange}></input>
                                            </div>
                                            <div className="col-sm-12" style={{height: '10px'}}></div>

                                            <label className="col-sm-4 control-label">Status</label>
                                            <div className="col-sm-8">
                                                <input className="form-control" value={this.state.status} onChange={this.statusChange}></input>
                                            </div>
                                            <div className="col-sm-12" style={{height: '10px'}}></div>


                                        </div>
                                        <div className='col-sm-12' style={{padding:0}}>
                                            <div className='col-sm-6'></div>
                                            <div className='col-sm-6'>
                                                <div className="col-sm-4 col-sm-offset-8" style={{paddingTop:'15px'}}>
                                                    <input className="btn btn-lg btn-success btn-block"
                                                           onClick={this.submitClicked}
                                                           value={isEmptyTask() ? 'Add Task' : 'Update'} readOnly={true}/>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

module.exports = task