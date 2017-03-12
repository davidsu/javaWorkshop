import React from 'react'
import _ from 'lodash'
import ajax from '../ajax.js'

function isEmptyUser(){
    return _.every(window.store.user, val=>!val);
}
class user extends React.Component{

    constructor() {
        super()
        this.state = {
            user: isEmptyUser() ? _.omit(window.store.user, ['id']) : window.store.user
        }
        this.submitClicked = this.submitClicked.bind(this);
    }
    close() {
        window.activeMenu = 'users';
        rootComponent.forceUpdate();
    }

    submitClicked() {
        if(isEmptyUser()){
            ajax.createUser(_.reduce(this.state.user, (acc, val, key)=>{
                const elem = document.getElementById('user'+key);
                acc[key] = elem.value;
                return acc;
            }, {}));
        } else {
            ajax.updateUser();
        }
        window.activeMenu = 'users';
        rootComponent.forceUpdate();
    }

    componentDidMount() {
        _.forEach(this.state.user, (val, key) => {
            const element = document.getElementById('user'+key);
            element.value = val;
        })
    }

    render() {
        return (
            <div className="container">
                <div className="row" style={{marginTop:40 + 'px'}}>
                    <div className="col-md-4 col-md-offset-4 ">
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
                                            return (
                                                <div className="form-group" key={'user'+key}>
                                                    <input className="form-control" placeholder={key} name={key}
                                                           type="text" id={'user'+key}/>
                                                </div>
                                                )
                                        })}
                                        <br/>
                                        <input className="btn btn-lg btn-success btn-block" onClick={this.submitClicked}
                                               value={isEmptyUser() ? 'Add User' : 'Update'} readOnly={true}/>
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