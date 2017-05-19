import React from 'react'
import DropDown from './dropDown.jsx'
import _ from 'lodash'
import ajax from '../ajax.js'
import userController from '../controllers/userController.js'

class user extends React.Component{

    constructor(props) {
        super(props)
        this.isEmptyUser = () => _.every(props.user, val=>!val);
        this.state = {
            user: this.isEmptyUser() ? _.omit(props.user, ['id']) : props.user
        }
        this.submitClicked = this.submitClicked.bind(this);
        this.deleteClicked = this.deleteClicked.bind(this);
        this.close = () => userController.goToUsers()
        this.userTypeChange = this.userTypeChange.bind(this)
    }

    deleteClicked() {
        if (this.isEmptyUser()) {
            this.close()
        } else {
            userController.deleteUser(this.props.user.id)
        }
    }

    submitClicked() {
        const user = _.reduce(this.state.user, (acc, val, key)=>{
            const elem = document.getElementById('user'+key);
            if(elem) acc[key] = elem.value;
            return acc;
        }, {}) 
        user.type = this.state.user.type
        if(!_.every(['full_name', 'type', 'email', 'password'], key => !!user[key])) {
            this.setState({className: 'invalid'})
            return;
        }
        userController.createOrUpdate(user)
    }

    userTypeChange(e){
        const user = this.state.user
        user.type = e.target.value
        this.setState({user})
    }

    componentDidMount() {
        _.forEach(this.state.user, (val, key) => {
            const element = document.getElementById('user'+key);
            if(element) element.value = val;
        })
    }

    render() {
        return (
            <div className="container">
                <h1 style={{textAlign: 'center', fontFamily:'arialBlack', fontSize:'5em', marginTop:'40px'}}>User Form</h1>
                <div className="row" style={{marginTop:40 + 'px'}}>
                    <div className="col-md-6 col-md-offset-3 ">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">User</h3>
                                <div className="pull-right">
                                    <button type="button" className="close table-filter-btn" onClick={this.close}>x</button>
                                </div>
                            </div>
                            <div className="panel-body">
                                <form role="form">
                                    <fieldset>
                                        {_.map(this.state.user, (val, key) => {
                                            const disabled={disabled: key === 'id'}
                                            if(key === 'type'){
                                                return (
                                                    <div className="form-group" key={'user'+key}>
                                                        <DropDown label={key+'*'}
                                                            className={!this.state.user.type && this.state.className}
                                                            value={val}
                                                            onChange={this.userTypeChange}
                                                            optionsArr={this.props.userTypes}
                                                            optionKey='userType'/>
                                                    </div>
                                                )
                                            }
                                            return (
                                                <div className="form-group" key={'user'+key} >
                                                    <div className="col-sm-12" style={{padding:0}}>
                                                        <label className="col-sm-4 control-label">{key+'*'}</label>
                                                        <div className="col-sm-8">
                                                            <input className={'from-control col-sm-12 ' + ( !_.get(document.getElementById('user'+key), 'value') && this.state.className)}
                                                                placeholder={key} 
                                                                name={key}
                                                                type="text"
                                                                id={'user'+key}
                                                                style={{borderRadius:'4px'}}
                                                                {...disabled}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-12" style={{height: '10px'}}></div>
                                                </div>
                                                )
                                        })}
                                        <br/>
                                        <div className="col-sm-12">
                                            <div className="col-sm-6">
                                                <input className="btn btn-lg btn-danger btn-block" onClick={this.deleteClicked}
                                                    value={this.isEmptyUser() ? 'Cancel' : 'Delete'} readOnly={true}/>
                                            </div>
                                            <div className="col-sm-6">
                                                <input className="btn btn-lg btn-success btn-block" onClick={this.submitClicked}
                                                    value={this.isEmptyUser() ? 'Add User' : 'Update'} readOnly={true}/>
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
    }}

module.exports = user;
