import React from 'react'
import _ from 'lodash'
class user extends React.Component{
    close() {
        window.activeMenu = 'users';
        rootComponent.forceUpdate();
    }

    submitClicked() {
        window.activeMenu = 'users';
        rootComponent.forceUpdate();
    }

    componentDidMount() {
        _.forEach(window.store.user, (val, key) => {
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
                                    <button type="button" className="close" onClick={this.close}>x</button>
                                </div>
                            </div>
                            <div className="panel-body">
                                <form role="form">
                                    <fieldset>
                                        {_.map(window.store.user, (val, key) => {
                                            return (
                                                <div className="form-group" key={'user'+key}>
                                                    <input className="form-control" placeholder={key} name={key}
                                                           type="text" id={'user'+key}/>
                                                </div>
                                                )
                                        })}
                                        <br/>
                                        <input className="btn btn-lg btn-success btn-block" onClick={this.submitClicked}
                                               value="Update" readOnly={true}/>
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