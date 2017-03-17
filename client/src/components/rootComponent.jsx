import React from 'react'
import NavigationMenu from './navigationMenu.jsx'
import SystemLogin from './systemLogin.jsx'
import Tasks from './tasks.jsx'
import Task from './task.jsx'
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
            case /tasks/.test(window.activeMenu):
                return <Tasks tasks={window.store.tasks}></Tasks>
            case /users/.test(window.activeMenu):
                return <Users users={window.store.users}></Users>
            case /user:.*/.test(window.activeMenu):
                return <User user={window.store.user}></User>
            case /task:.*/.test(window.activeMenu):
                return <Task {...window.store.task}></Task>
            default:
                return null;
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