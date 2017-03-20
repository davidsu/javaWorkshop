import React from 'react'
import _ from 'lodash'
import ajax from '../ajax.js'

class user extends React.Component{

    constructor(props) {
        super(props)
        this.isEmptyUser = () => _.every(props.user, val=>!val);
        this.state = {
            user: this.isEmptyUser() ? _.omit(props.user, ['id']) : props.user
        }
        this.submitClicked = this.submitClicked.bind(this);
        this.close = this.props.onClose
    }

    submitClicked() {
        ajax.createOrUpdateUser(_.reduce(this.state.user, (acc, val, key)=>{
            const elem = document.getElementById('user'+key);
            acc[key] = elem.value;
            return acc;
        }, {}), () => {
            setTimeout(() => {
                ajax.getUsers(() => {
                    this.props.onClose()
                })
            }, 200)

        });
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
                                    <button type="button" className="close table-filter-btn" onClick={this.props.onClose}>x</button>
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
                                               value={this.isEmptyUser() ? 'Add User' : 'Update'} readOnly={true}/>
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