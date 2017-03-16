import React from 'react'

class dropDown extends React.Component{
    render(){
        return(
            <div>
                <label className="col-sm-4 control-label">{this.props.label}</label>
                <div className="col-sm-8">
                    <select className="form-control" value={this.props.value} onChange={this.props.onChange}>
                        {_.map(this.props.optionsArr, _option => {
                            return (
                                <option
                                    key={_option.id+this.props.label}
                                    value={_option.id}>
                                    {_option[this.props.optionKey]}
                                </option>
                            )
                        })}
                    </select>
                </div>
                <div className="col-sm-12" style={{height: '10px'}}></div>
            </div>
        )
    }
}

module.exports = dropDown