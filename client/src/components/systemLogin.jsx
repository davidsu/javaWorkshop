import React from 'react'
import ajax from '../ajax.js'
class systemLogin extends React.Component {
    constructor(){
        super()
        this.state = {}
        this.onUserChange = e => this.setState({user: e.target.value})
        this.onPasswordChange = e => this.setState({password: e.target.value})
        this.submitClicked = this.submitClicked.bind(this)
    }
    submitClicked() {
        ajax.login(this.state.user, this.state.password, token => {
            console.log(token)
            window.store.token = token
            window.store.activeMenu = 'tasks';
            rootComponent.forceUpdate()
        })
    }
    render() {
        return (
            <div className="container">
                <div className="row" style={{marginTop:120 + 'px'}}>
                    <div className="col-md-4 col-md-offset-4 ">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">Please sign in</h3>
                            </div>
                            <div className="panel-body">
                                <form role="form">
                                    <fieldset>
                                        <div className="form-group">
                                            <input className="form-control" placeholder="E-mail" name="email"
                                                   type="text" id="emailInput" value={this.state.user} onChange={e=>console.log(e.target.value)}/>
                                        </div>

                                        <div className="form-group">
                                            <input className="form-control" placeholder="Password" name="password"
                                                   type="password" id="passwordInput"/>
                                        </div>
                                        <br/>
                                        <br/>
                                        <input className="btn btn-lg btn-success btn-block" onClick={this.submitClicked}
                                               value="Login" readOnly={true}/>
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
module.exports = systemLogin