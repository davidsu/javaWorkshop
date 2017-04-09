import React from 'react'

class dropDown extends React.Component{
    componentDidMount(){
        if(this.props.value === undefined){
            this.select.value = undefined
        }
    }
    render(){
        return(
            <div className="col-sm-12" style={{padding:0}}>
                <label className="col-sm-4 control-label">{this.props.label+(this.props.isRequired?'*':'')}</label>
                <div className="col-sm-8">
                    <select className={'form-control ' + this.props.className} value={this.props.value} onChange={this.props.onChange} ref={(select) => this.select = select}>
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
