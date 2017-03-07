import React from 'react'

window.activeMenu = '';
class navigationMenu extends React.Component {
    setActiveMenu(activeMenu) {
        window.activeMenu = activeMenu;
        rootComponent.forceUpdate();
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