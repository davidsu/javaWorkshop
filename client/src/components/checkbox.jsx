import React from 'react'

class checkbox extends React.Component{
    render() {
        return(
            <div className="col-sm-12 control-label">
                <label className="col-sm-12" style={{padding:"2px 0"}}>
                    <input type="checkbox" checked={this.props.checked} onChange={this.props.onChange}/> {this.props.label}
                </label>
            </div>
        )
    }
}

module.exports = checkbox;