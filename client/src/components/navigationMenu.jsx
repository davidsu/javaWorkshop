import React from 'react'
import ajax from '../ajax.js'

class navigationMenu extends React.Component {
    constructor(props) {
        super(props);
        this.setActiveMenu = this.setActiveMenu.bind(this)
        //this.setActiveMenu(props.getActiveMenu);
    }

    setActiveMenu(activeMenu) {
        const self = this
        switch(activeMenu){
            case 'users':
                ajax.getUsers(() => {
                    self.props.setActiveMenu(activeMenu)
                })
                break;
            case 'tasks':
                ajax.getTasks(() => {
                    self.props.setActiveMenu(activeMenu)
                })
                break;
            default:
                self.props.setActiveMenu(activeMenu)
        }
    }
    render() {
        //return null;
        return (
            <nav className="navbar navbar-default navbar-static-top">
                <div className="container">
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            <li className={this.props.activeMenu === 'tasks' ? 'active' : ''}>
                                <a onClick={()=>this.setActiveMenu('tasks')}>Request List</a>
                            </li>
                            <li className={this.props.activeMenu === 'users' ? 'active' : ''}>
                                <a onClick={()=>this.setActiveMenu('users')}>Users</a>
                            </li>
                            <li className={this.props.activeMenu === 'login' ? 'active' : ''}>
                                <a onClick={()=>this.setActiveMenu('login')}>Login</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}
module.exports = navigationMenu