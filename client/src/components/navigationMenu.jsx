import React from 'react'
import ajax from '../ajax.js'

window.activeMenu = '';
class navigationMenu extends React.Component {
    constructor() {
        super();
        this.setActiveMenu(window.activeMenu);
    }

    setActiveMenu(activeMenu) {
        switch(activeMenu){
            case 'users':
                ajax.getUsers(() => {
                    window.activeMenu = activeMenu;
                    rootComponent.forceUpdate();
                })
                break;
            case 'tasks':
                ajax.getTasks(() => {
                    window.activeMenu = activeMenu;
                    rootComponent.forceUpdate();
                })
                break;
            default:
                window.activeMenu = activeMenu;
                rootComponent.forceUpdate();
        }
    }
    render() {
        return (
            <nav className="navbar navbar-default navbar-static-top">
                <div className="container">
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            <li className={activeMenu === 'tasks' ? 'active' : ''}>
                                <a onClick={()=>this.setActiveMenu('tasks')}>Request List</a>
                            </li>
                            <li className={activeMenu === 'users' ? 'active' : ''}>
                                <a onClick={()=>this.setActiveMenu('users')}>Users</a>
                            </li>
                            <li className={activeMenu === 'login' ? 'active' : ''}>
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