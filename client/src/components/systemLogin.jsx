import React from 'react'
//<div>
//    <h1>System Login</h1>
//    <span style={{width: '200px'}}>User:</span>
//    <input></input>
//    <br/>
//    <span style={{width: '200px'}}>Password:</span>
//    <input></input>
//</div>
class systemLogin extends React.Component {
    submitClicked() {
        alert(`email: ${$('#emailInput').val()}\npassword: ${$('#passwordInput').val()}`);
    }
    render() {
        return (
            <div className="container">
                <div className="row vertical-offset-100">
                    <div className="col-md-4 col-md-offset-4">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">Please sign in</h3>
                            </div>
                            <div className="panel-body">
                                <form role="form">
                                    <fieldset>
                                        <div className="form-group">
                                            <input className="form-control" placeholder="E-mail" name="email"
                                                   type="text" id="emailInput"/>
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