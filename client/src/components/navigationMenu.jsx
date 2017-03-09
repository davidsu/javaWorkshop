import React from 'react'

window.activeMenu = '';
class navigationMenu extends React.Component {

    setActiveMenu(activeMenu) {
        switch(activeMenu){
            case 'users':
                $.get('users', (data, status) => {
                    const parser = new DOMParser()
                    const xmlDoc = parser.parseFromString(data, 'text/xml');
                    window.store.users = _.map(xmlDoc.getElementsByTagName('user'), userElement => {
                        return {
                            id: userElement.querySelector('id').textContent,
                            full_name: userElement.querySelector('full_name').textContent,
                            type: userElement.querySelector('type').textContent,
                            email: userElement.querySelector('email').textContent,
                            password: userElement.querySelector('password').textContent,
                        }
                    })
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