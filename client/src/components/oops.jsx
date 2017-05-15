import React from 'react'

class oops extends React.Component{
    goHomeClicked(){
        Store.setActiveMenu('login');
        rootComponent.forceUpdate();
    }
    additionalServerMessage(){
        if(this.props.responseText){
            return (<div className="error-details">
                    {this.props.responseText}
            </div>)
        }
        return null;

    }
    render(){
        return (
            <div className="oops" style={{minHeight: '100vh', display: 'flex', alignItems: 'center'}}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="error-template">
                                <h1>Oops!</h1>
                                <h2>{this.props.status} {this.props.statusText}</h2>
                                {this.additionalServerMessage()}
                                <div className="error-actions">
                                    <button onClick={this.goHomeClicked} className="btn btn-primary btn-lg">
                                        <span className="glyphicon glyphicon-home"></span>
                                        Take Me Home
                                    </button>
                                    <a href={"mailto:dchamud@gmail.com?Subject="+this.props.status+'%20'+this.props.statusText} className="btn btn-default btn-lg">
                                        <span className="glyphicon glyphicon-envelope"></span>
                                        Contact Support
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

module.exports = oops
