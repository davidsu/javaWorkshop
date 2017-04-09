import React from 'react'
import DropDown from './dropDown.jsx'
import CheckBox from './checkbox.jsx'
import ajax from '../ajax.js'
import _ from 'lodash'

import DatePicker from 'react-datepicker';

class task extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.task.id,//used
            taskTypeId: props.task.taskTypeId || undefined,//used
            productId: props.task.productId || undefined,//used
            envId: props.task.envId || undefined,//used
            requesterId: props.task.requesterId || undefined,//used
            priorityId: props.task.priorityId || undefined,//used
            open_date: props.task.open_date || moment().format('YYYY-MM-DD'),//used
            exec_date: props.task.exec_date|| moment().format('YYYY-MM-DD'),
            statusId: props.task.statusId || undefined,//used
            qaGO: !!props.task.qaGO,//used
            rollBack: !!props.task.rollBack,//used
            urgent: !!props.task.urgent,//used
            assigneeId: props.task.assigneeId || undefined,
            resolved_by_Id: props.task.resolved_by_Id || undefined,
            additionalInfo: props.task.additionalInfo//used
        }
        this.submitClicked = this.submitClicked.bind(this)
        this.isEmptyTask = _.isEmpty(this.props.task)
        this.typeChange = e => this.setState({taskTypeId: e.target.value})
        this.productChange = e => this.setState({productId: e.target.value})
        this.environmentChange = e => this.setState({envId: e.target.value})
        this.requesterChange = e => this.setState({requesterId: e.target.value})
        this.assigneeChange = e => this.setState({assigneeId: e.target.value})
        this.resolvedByChange = e => this.setState({resolved_by_Id: e.target.value})
        this.priorityChange = e => this.setState({priorityId: e.target.value})
        this.statusChange = e => this.setState({statusId: e.target.value})
        this.executionDateChange = e => e && this.setState({exec_date: e.format('YYYY-MM-DD')})
        this.qaGoChanged = e => this.setState({qaGO: !this.state.qaGO})
        this.rollBackChanged = e => this.setState({rollBack: !this.state.rollBack})
        this.urgentChanged = e => this.setState({urgent: !this.state.urgent})
        this.additionalInfoChanged = e => {console.log(e.target.value); this.setState({additionalInfo: e.target.value})}
        this.onClose = () => props.onClose()
    }

    
     submitClicked(){
        if (!_.every(['taskTypeId',
                'productId',
                'envId',
                'requesterId',
                'priorityId',
                'open_date',
                'exec_date',
                'statusId'], key => this.state[key])) {
            this.setState({className: 'invalid'})
            return;
        }
        this.props.createOrUpdate(_.pickBy(this.state, (val, key) => key !== 'className'))
    }

    render() {
        return (
            <div className="container">
                <div className="row" style={{marginTop:40 + 'px'}}>
                    <div className="col-md-12 ">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h2 className="panel-title"><span style={{textDecoration: 'underline', color:'#555'}}>TASK</span> {this.state.id ? ': id = ' + this.state.id : ''}</h2>

                                <div className="pull-right">
                                    <button type="button" className="close table-filter-btn" onClick={this.onClose}>x
                                    </button>
                                </div>
                            </div>
                            <div className="panel-body">
                                <form role="form">
                                    <fieldset>
                                        <div className='col-sm-6'>
                                            <DropDown className={!this.state.taskTypeId && this.state.className}
                                                isRequired={true} label='Type'
                                                value={this.state.taskTypeId}
                                                onChange={this.typeChange}
                                                optionsArr={this.props.taskTypes}
                                                optionKey='taskType'/>
                                            <DropDown className={!this.state.productId && this.state.className} isRequired={true} label='Product'
                                                value={this.state.productId}
                                                onChange={this.productChange}
                                                optionsArr={this.props.products}
                                                optionKey='productName'/>
                                            <DropDown className={!this.state.envId && this.state.className} isRequired={true} label='Environment'
                                                value={this.state.envId}
                                                onChange={this.environmentChange}
                                                optionsArr={this.props.environments}
                                                optionKey='envName'/>
                                            <DropDown className={!this.state.requesterId && this.state.className} isRequired={true} label='Requester'
                                                value={this.state.requesterId}
                                                onChange={this.requesterChange}
                                                optionsArr={this.props.users}
                                                optionKey='full_name'/>
                                            <DropDown label='Assignee'
                                                      value={this.state.assigneeId}
                                                      onChange={this.assigneeChange}
                                                      optionsArr={this.props.users}
                                                      optionKey='full_name'/>

                                            <label className="col-sm-12 control-label">Additional Info</label>
                                            <div className="col-sm-12">
                                            <textarea className="col-sm-12 form-control custom-control"
                                                      rows="12"
                                                      style={{resize:'none'}}
                                                      value={this.state.additionalInfo}
                                                      onChange={this.additionalInfoChanged}
                                                ></textarea>
                                                </div>
                                        </div>

                                        <div className='col-sm-6'>
                                            <label className="col-sm-4 control-label">Open Date</label>
                                            <div className="col-sm-8">
                                                <input className="form-control" disabled value={this.state.open_date}/>
                                            </div>
                                            <div className="col-sm-12" style={{height: '10px'}}></div>

                                            <label className="col-sm-4 control-label">Execution Date*</label>
                                            <div className="col-sm-8">
                                                <DatePicker
                                                    dateFormat="YYYY-MM-DD"
                                                    className="form-control col-sm-12"
                                                    selected={moment(this.state.exec_date)}
                                                    onChange={this.executionDateChange} />
                                            </div>
                                            <div className="col-sm-12" style={{height: '10px'}}></div>

                                            <DropDown className={!this.state.priorityId && this.state.className} isRequired={true} label='Priority'
                                                      value={this.state.priorityId}
                                                      onChange={this.priorityChange}
                                                      optionsArr={this.props.priority}
                                                      optionKey='priorityName'/>
                                            <DropDown className={!this.state.statusId && this.state.className} isRequired={true} label='Status'
                                                      value={this.state.statusId}
                                                      onChange={this.statusChange}
                                                      optionsArr={this.props.status}
                                                      optionKey='statusName'/>
                                            <DropDown label='Resolved By'
                                                      value={this.state.resolved_by_Id}
                                                      onChange={this.resolvedByChange}
                                                      optionsArr={this.props.users}
                                                      optionKey='full_name'/>


                                            <div className="col-sm-12" style={{height: '20px'}}></div>
                                            <CheckBox checked={this.state.qaGO} onChange={this.qaGoChanged} label='QA GO'/>
                                            <CheckBox checked={this.state.rollBack} onChange={this.rollBackChanged} label='Rollback included'/>
                                            <CheckBox checked={this.state.urgent} onChange={this.urgentChanged} label='Urgent'/>
                                        </div>
                                        <div className='col-sm-12' style={{padding:0}}>
                                            <div className='col-sm-6'></div>
                                            <div className='col-sm-6'>
                                                <div className="col-sm-4 col-sm-offset-8" style={{paddingTop:'15px'}}>
                                                    <input className="btn btn-lg btn-success btn-block"
                                                           onClick={this.submitClicked}
                                                           value={this.isEmptyTask ? 'Add Task' : 'Update'} readOnly={true}/>
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
