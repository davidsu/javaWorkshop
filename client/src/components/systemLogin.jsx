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
    submitClicked(e) {
        e.preventDefault()
        e.stopPropagation()
        const self = this;
        ajax.login(this.state.user, this.state.password, token => {
            window.token = token
            self.props.onDone()
        }, (jqXHR, textStatus, errorThrown) => {
            alert(`server returned with ${jqXHR.status}: ${errorThrown}`)
        })
    }
    componentDidMount(){
        this.emailInput.focus(); 
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
                                <form role="form" onSubmit={this.submitClicked}>
                                    <fieldset>
                                        <div className="form-group">
                                            <input className="form-control" placeholder="E-mail" name="email" ref={(input) => { this.emailInput = input; }} 
                                                   type="text" id="emailInput" value={this.state.user} onChange={this.onUserChange}/>
                                        </div>

                                        <div className="form-group">
                                            <input className="form-control" placeholder="Password" name="password"
                                                   type="password" id="passwordInput" value={this.state.password} onChange={this.onPasswordChange}/>
                                        </div>
                                        <br/>
                                        <br/>
                                        <input className="btn btn-lg btn-success btn-block" type="submit"
                                               value="Login" readOnly={true} />
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
