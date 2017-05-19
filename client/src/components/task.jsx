import React from 'react'
import DropDown from './dropDown.jsx'
import CheckBox from './checkbox.jsx'
import ajax from '../ajax.js'
import _ from 'lodash'

import DatePicker from 'react-datepicker';

class task extends React.Component {
    //todo: add files links on top of upload files button. remove upload file button for users that can only view the bloddy file. add a way to remove the file
    //add file entry into the database and teach the server to handle these files    
    constructor(props) {
        super(props)
        this.state = {
            id: props.task.id,
            taskTypeId: props.task.taskTypeId || undefined,
            productId: props.task.productId || undefined,
            envId: props.task.envId || undefined,
            requesterId: props.task.requesterId || undefined,
            priorityId: props.task.priorityId || undefined,
            open_date: props.task.open_date || moment().format('YYYY-MM-DD'),
            exec_date: props.task.exec_date|| moment().format('YYYY-MM-DD'),
            statusId: props.task.statusId || undefined,
            qaGO: !!props.task.qaGO,
            rollBack: !!props.task.rollBack,
            urgent: !!props.task.urgent,
            assigneeId: props.task.assigneeId || undefined,
            resolved_by_Id: props.task.resolved_by_Id || undefined,
            additionalInfo: props.task.additionalInfo,
            files: props.task.files || ''
        }
        this.disableUpdateButton = {disabled: this.state.statusId == _.filter(props.status, {statusName: 'Done'})[0].id}
        this.generateDownloadFilesAnchors = this.generateDownloadFilesAnchors.bind(this)
        this.uploadFile = this.uploadFile.bind(this)
        this.submitClicked = this.submitClicked.bind(this)
        this.isEmptyTask = _.isEmpty(this.props.task)
        this.deleteFile = this.deleteFile.bind(this)
        this.typeChange = e => this.setState({taskTypeId: e.target.value})
        this.productChange = e => this.setState({productId: e.target.value})
        this.environmentChange = e => this.setState({envId: e.target.value})
        this.requesterChange = e => this.setState({requesterId: e.target.value})
        this.assigneeChange = e => this.setState({assigneeId: e.target.value})
        this.resolvedByChange = e => this.setState({resolved_by_Id: e.target.value})
        this.priorityChange = e => this.setState({priorityId: e.target.value})
        this.statusChange = e => this.setState({statusId: e.target.value})
        this.executionDateChange = e => e && this.setState({exec_date: e.format('YYYY-MM-DD')})
        this.qaGoChanged = e => this.props.shouldEnableTaskEdit && this.setState({qaGO: !this.state.qaGO})
        this.rollBackChanged = e => this.props.shouldEnableTaskEdit && this.setState({rollBack: !this.state.rollBack})
        this.urgentChanged = e => this.props.shouldEnableTaskEdit && this.setState({urgent: !this.state.urgent})
        this.additionalInfoChanged = e => {console.log(e.target.value); this.props.shouldEnableTaskEdit && this.setState({additionalInfo: e.target.value})}
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

    uploadFile(e){
        const fileName = ajax.uploadFile(e.target.files[0], (fileName) => {
            let files = this.state.files;
            if (!files) {
                files = [];
            } else {
                files = files.split(',');
            }
            this.setState({files: files.concat([fileName]).join(',')})
        })
        e.target.value = ''
    }

    deleteFile (fileName) {
        const files = _.filter(this.state.files.split(','), fname => fname !== fileName).join(',')
        this.setState({files})
    }

    generateDownloadFilesAnchors() {
        if (!this.state.files){
            return null
        }
        return _.map(this.state.files.split(','), fileName => {
            return(
                <div className="col-sm-12" key={fileName} style={{border:"1px solid #dadada", marginBottom:"5px"}}>
                    <div className="col-sm-10">
                        <a className="col-sm-12" href={'file/download/'+fileName} download>{fileName.replace(/_[^_]+_/, '')}</a>
                    </div>
                <div className="col-sm-2" style={{visibility: (this.props.shouldEnableTaskEdit && !this.disableUpdateButton.disabled) ? 'visible' : 'hidden'}}>
                        <button type="button" className="close" onClick={() => this.deleteFile(fileName)}>x</button>
                    </div>
                </div>
            )
        })
    }

    render() {
        const disabled = this.props.shouldEnableTaskEdit? {} : {disabled: true}
        let exec_date = (
            <DatePicker
                dateFormat="YYYY-MM-DD"
                className="form-control col-sm-12"
                selected={moment(this.state.exec_date)}
                onChange={this.executionDateChange} />
        )
        if(disabled.disabled){
            exec_date = <input className="form-control" disabled value={this.state.exec_date}/>
        }

        return (
            <div className="container">
                <h1 style={{textAlign: 'center', fontFamily:'arialBlack', fontSize:'5em', marginTop:'40px'}}>Task Form</h1>
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
                                                disabled={disabled}
                                                isRequired={true} label='Type'
                                                value={this.state.taskTypeId}
                                                onChange={this.typeChange}
                                                optionsArr={this.props.taskTypes}
                                                optionKey='taskType'/>
                                            <DropDown className={!this.state.productId && this.state.className} isRequired={true} label='Product'
                                                disabled={disabled}
                                                value={this.state.productId}
                                                onChange={this.productChange}
                                                optionsArr={this.props.products}
                                                optionKey='productName'/>
                                            <DropDown className={!this.state.envId && this.state.className} isRequired={true} label='Environment'
                                                disabled={disabled}
                                                value={this.state.envId}
                                                onChange={this.environmentChange}
                                                optionsArr={this.props.environments}
                                                optionKey='envName'/>
                                            <DropDown className={!this.state.requesterId && this.state.className} isRequired={true} label='Requester'
                                                disabled={disabled}
                                                value={this.state.requesterId}
                                                onChange={this.requesterChange}
                                                optionsArr={this.props.users}
                                                optionKey='full_name'/>
                                            <DropDown label='Assignee'
                                                disabled={disabled}
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
                                                {exec_date}
                                            </div>
                                            <div className="col-sm-12" style={{height: '10px'}}></div>

                                            <DropDown className={!this.state.priorityId && this.state.className} isRequired={true} label='Priority'
                                                disabled={disabled}
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

                                            {this.generateDownloadFilesAnchors()}
                                            <div className="col-sm-offset-2 col-sm-8" style={{visibility: (this.props.shouldEnableTaskEdit && !this.disableUpdateButton.disabled) ? 'visible' : 'hidden'}}>
                                                <label className="btn btn-lg btn-primary btn-block"
                                                    style={{padding: '5px'}}
                                                    readOnly={true}>Upload File
                                                    <input type='file' style={{display:'none'}} onChange={this.uploadFile}/>
                                                    </label>
                                            </div>
                                            <div className="col-sm-12" style={{height: '40px'}}></div>
                                            <CheckBox checked={this.state.qaGO} onChange={this.qaGoChanged} label='QA GO'/>
                                            <CheckBox checked={this.state.rollBack} onChange={this.rollBackChanged} label='Rollback included'/>
                                            <CheckBox checked={this.state.urgent} onChange={this.urgentChanged} label='Urgent'/>
                                        </div>
                                        <div className='col-sm-12' style={{padding:0}}>
                                            <div className='col-sm-6'>
                                            </div>
                                            <div className='col-sm-6'>
                                                <div className="col-sm-4 col-sm-offset-8" style={{paddingTop:'15px'}}>
                                                    <input className="btn btn-lg btn-success btn-block"
                                                           onClick={this.submitClicked}
                                                           value={this.isEmptyTask ? 'Add Task' : 'Update'}
                                                           {...this.disableUpdateButton}
                                                           readOnly={true}/>
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
