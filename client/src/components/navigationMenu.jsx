import React from 'react'
import userController from '../controllers/userController.js'
import taskController from '../controllers/taskController'
import store from '../store.js'

class navigationMenu extends React.Component {
    constructor(props) {
        super(props);
        this.setActiveMenu = this.setActiveMenu.bind(this)
    }

    setActiveMenu(activeMenu) {
        if(this.props.activeMenu === activeMenu) {
            return
        }
        switch(activeMenu){
            case 'users':
                userController.getUsers()
                break;
            case 'tasks':
                taskController.goToTasks()
                break;
            default:
                this.props.setActiveMenu(activeMenu)
        }
    }
    render() {
        if (store.getUserType() !== 'Admin') {
            return null;
        }
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
