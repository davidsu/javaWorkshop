import React from 'react'
import NavigationMenu from './navigationMenu.jsx'
import SystemLogin from './systemLogin.jsx'
import Request from './request.jsx'
import Users from './users.jsx'
import User from './user.jsx'
class rootComponent extends React.Component {

    componentWillMount(){
        window.rootComponent = this;
    }

    getUsers() {
        $.get('users', (data, status) => {
            $('#response').html(_.escape(data).replace(/\n/gm, '<br>'))
        })
    }

    activePage() {
        switch(true) {
            case /login/.test(window.activeMenu):
                return <SystemLogin></SystemLogin>
            case /request/.test(window.activeMenu):
                return <Request></Request>
            case /users/.test(window.activeMenu):
                return <Users users={window.store.users}></Users>
            case /user:.*/.test(window.activeMenu):
                return <User user={window.store.user}></User>
            default:
                return (
                    <div className="container row">
                        <h1>Hello World Html</h1>
                        <button id="getUsers" onClick={this.getUsers}>getUsers</button>
                        <div id="response"></div>
                    </div>
                );
        }
    }

    render() {
        return (
            <div>
                <NavigationMenu></NavigationMenu>
                {this.activePage()}
            </div>
        )
    }
}
module.exports = rootComponent