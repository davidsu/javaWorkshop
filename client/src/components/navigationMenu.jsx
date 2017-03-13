import React from 'react'
import ajax from '../ajax.js'

window.activeMenu = '';
class navigationMenu extends React.Component {
    constructor() {
        super();
        if(window.activeMenu === 'users' && !window.store.users){
            this.setActiveMenu('users');
        }
    }

    setActiveMenu(activeMenu) {
        switch(activeMenu){
            case 'users':
                ajax.getUsers(() => {
                    window.activeMenu = activeMenu;
                    rootComponent.forceUpdate();
                })
                break;
            case 'request':
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
                            <li className={activeMenu === 'request' ? 'active' : ''}>
                                <a onClick={()=>this.setActiveMenu('request')}>Request List</a>
                            </li>
                            <li className={activeMenu === 'admin' ? 'active' : ''}>
                                <a onClick={()=>this.setActiveMenu('admin')}>Admin</a>
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