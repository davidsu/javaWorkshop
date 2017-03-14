import React from 'react'

function isEmptyTask(){return false;}
class request extends React.Component {
    constructor(props) {
        super(props)
        console.log(props)
    }

    close() {
    }
    submitClicked(){}


    render() {
        return (
            <div className="container">
                <div className="row" style={{marginTop:40 + 'px'}}>
                    <div className="col-md-12 ">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">Task</h3>

                                <div className="pull-right">
                                    <button type="button" className="close table-filter-btn" onClick={this.close}>x
                                    </button>
                                </div>
                            </div>
                            <div className="panel-body">
                                <form role="form">
                                    <fieldset>
                                        <div className='col-sm-6'>
                                            <label className="col-sm-4 control-label">Type</label>

                                            <div className="col-sm-8">
                                                <select className="form-control">
                                                    <option>one</option>
                                                    <option>two</option>
                                                </select>
                                            </div>
                                            <div className="col-sm-12" style={{height: '10px'}}></div>

                                            <label className="col-sm-4 control-label">Type</label>

                                            <div className="col-sm-8">
                                                <select className="form-control">
                                                    <option>one</option>
                                                    <option>two</option>
                                                </select>
                                            </div>
                                            <div className="col-sm-12" style={{height: '10px'}}></div>

                                            <label className="col-sm-4 control-label">Type</label>

                                            <div className="col-sm-8">
                                                <select className="form-control">
                                                    <option>one</option>
                                                    <option>two</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className='col-sm-6'>
                                            <label className="col-sm-4 control-label">Type</label>

                                            <div className="col-sm-8">
                                                <select className="form-control">
                                                    <option>one</option>
                                                    <option>two</option>
                                                </select>
                                            </div>
                                            <div className="col-sm-12" style={{height: '10px'}}></div>

                                            <label className="col-sm-4 control-label">Type</label>

                                            <div className="col-sm-8">
                                                <select className="form-control">
                                                    <option>one</option>
                                                    <option>two</option>
                                                </select>
                                            </div>
                                            <div className="col-sm-12" style={{height: '10px'}}></div>

                                            <label className="col-sm-4 control-label">Type</label>

                                            <div className="col-sm-8">
                                                <select className="form-control">
                                                    <option>one</option>
                                                    <option>two</option>
                                                </select>
                                            </div>
                                            <div className="col-sm-4 col-sm-offset-8" style={{paddingTop:'15px'}}>
                                                <input className="btn btn-lg btn-success btn-block"
                                                       onClick={this.submitClicked}
                                                       value={isEmptyTask() ? 'Add Task' : 'Update'} readOnly={true}/>
                                            </div>
                                        </div>

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

module.exports = request